"""Test the actual manifest and isolated/main worlds using synthetic X data."""
from pathlib import Path
from tempfile import TemporaryDirectory
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
html = '''<!doctype html><article data-testid="tweet"><div>
<div data-testid="User-Name"><a href="/alice">Alice</a></div></div></article>
<script>fetch('/i/api/graphql/test/HomeTimeline')</script>'''
with TemporaryDirectory() as profile, sync_playwright() as p:
    context = p.chromium.launch_persistent_context(
        profile, channel='chromium', headless=True, locale='en-US',
        ignore_default_args=['--disable-extensions'],
        args=[f'--disable-extensions-except={root}', f'--load-extension={root}'])
    context.route('https://x.com/home', lambda route: route.fulfill(
        content_type='text/html', body=html))
    context.route('https://x.com/i/api/graphql/**', lambda route: route.fulfill(
        content_type='application/json', body='''{"user":{"rest_id":"1",
        "legacy":{"screen_name":"alice","followers_count":12345,
        "friends_count":8,"following":true,"followed_by":true}}}'''))
    page = context.new_page()
    page.on('console', lambda message: print(message.text) if message.type == 'error' else None)
    page.on('pageerror', lambda error: print(str(error)))
    page.goto('https://x.com/home')
    page.wait_for_selector('.xx-account-info')
    page.evaluate("fetch('/i/api/graphql/test/HomeTimeline')")
    page.wait_for_function("document.querySelector('.xx-account-info').textContent.includes('Mutual follow')")
    assert '12.3K followers' in page.locator('.xx-account-info').inner_text()
    context.close()
print('PASS: actual manifest, isolated content scripts, main-world bridge and local storage')
