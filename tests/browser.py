"""Integration tests with synthetic X responses; no live-account data."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
origin='http://127.0.0.1:8765'
mock='''window.chrome={storage:{local:{get:async()=>({settings:JSON.parse(localStorage.getItem('settings')||'null')}),set:async(value)=>{localStorage.setItem('settings',JSON.stringify(value.settings));window.dispatchEvent(new CustomEvent('storage-update',{detail:value.settings}));}},onChanged:{addListener:fn=>window.addEventListener('storage-update',e=>fn({settings:{newValue:e.detail}},'local'))}},runtime:{openOptionsPage:()=>{}}};'''
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 page=browser.new_page(viewport={'width':980,'height':920},locale='en-US')
 errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
 page.add_init_script(mock)
 page.goto(origin+'/options.html');page.wait_for_load_state('networkidle')
 page.locator('#language').select_option('zh_CN')
 page.get_by_role('status').filter(has_text='已保存').wait_for()
 assert '粉丝 2.3万' in page.locator('#preview-badge').inner_text()
 page.locator('#followers').uncheck();assert '粉丝' not in page.locator('#preview-badge').inner_text()
 page.locator('#followers').check();page.locator('#numberFormat').select_option('full');assert '23,456' in page.locator('#preview-badge').inner_text()
 page.reload();page.wait_for_load_state('networkidle');assert page.locator('#numberFormat').input_value()=='full'
 page.locator('#numberFormat').select_option('compact')
 out=root/'test-results';out.mkdir(exist_ok=True);page.screenshot(path=str(out/'settings-zh.png'),full_page=True)
 page.emulate_media(color_scheme='dark');page.locator('#language').select_option('en');page.screenshot(path=str(out/'settings-en-dark.png'),full_page=True)
 page.goto(origin+'/options.html');page.wait_for_load_state('networkidle')
 page.set_content('''<article data-testid="tweet"><div><div data-testid="User-Name"><a href="/alice">Alice</a></div></div><p>Example tweet</p></article>''')
 for name in ['shared/model.js','shared/i18n.js','content.js']:page.add_script_tag(path=str(root/name))
 page.wait_for_selector('.xx-account-info');assert 'unknown' in page.locator('.xx-account-info').inner_text()
 def emit(users,epoch=0):
  page.evaluate("v=>window.postMessage({source:'xx-passive-v1',epoch:v.epoch,users:v.users},location.origin)",{'users':users,'epoch':epoch})
 emit([{'id':'1','handle':'alice','followers':12345,'following':8,'followsYou':True,'youFollow':True}])
 page.wait_for_function("document.querySelector('.xx-account-info').textContent.includes('Mutual follow')")
 assert '12.3K' in page.locator('.xx-account-info').inner_text()
 # recycled virtual timeline node must no longer display Alice's numbers
 page.locator('[data-testid="User-Name"] a').evaluate("a=>{a.href='/bob';a.textContent='Bob'}")
 page.wait_for_function("document.querySelector('.xx-account-info').textContent.includes('unknown followers')")
 emit([{'id':'2','handle':'bob','followers':7,'following':0,'followsYou':False,'youFollow':False}])
 page.wait_for_function("document.querySelector('.xx-account-info').textContent.includes('No follow connection')")
 emit([],1);page.wait_for_function("document.querySelector('.xx-account-info').textContent.includes('unknown followers')")
 emit([{'id':'2','handle':'bob','followers':999}],0)
 page.wait_for_timeout(100);assert '999' not in page.locator('.xx-account-info').inner_text()
 page.evaluate("chrome.storage.local.set({settings:{enabled:false}})");page.wait_for_function("!document.querySelector('.xx-account-info')")
 page.evaluate("chrome.storage.local.set({settings:{enabled:true,position:'inline'}})");page.wait_for_selector('[data-testid="User-Name"] .xx-account-info')
 assert len(errors)==0,errors
 browser.close()
 print('PASS: settings persistence, bilingual previews, dark mode, timeline updates, node reuse, account reset and toggles')
