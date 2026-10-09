# XX — Extra tools for X

**A little extra for your X.** See follower counts, following counts and follow relationships beside timeline authors.

[简体中文](README.md) · [Privacy](PRIVACY.md) · [Changelog](CHANGELOG.md)

Version **0.1.0** is a loadable Manifest V3 prototype. Synthetic-response and browser integration tests pass. Live signed-in X compatibility and installation in a real extension environment remain unverified. No Chrome Web Store release is available.

## Features

- Separate switches for follower counts, following counts and follow relationships.
- Display below or beside the username, with compact or full numbers.
- Distinguish mutual follow, follows you, following, no connection and unknown.
- English and Simplified Chinese; automatic browser-language detection or manual override.
- Auto-saved local settings, live sample preview and system light/dark styling.

## Install

Requires Chrome **111+**. No build, API key or npm dependencies are needed.

1. Download and extract the repository ZIP, or clone this repository.
2. Open `chrome://extensions` and enable Developer mode.
3. Click **Load unpacked** and select the directory containing `manifest.json`.
4. Refresh X so new page requests can be observed.
5. Click the XX toolbar icon and choose **Open settings**.

After an update, reload the extension and refresh X. Unknown values mean the page has not provided the relevant fields; normal browsing may load them later.

## Architecture and privacy

The MAIN-world bridge observes JSON returned by X's own `fetch` and `XMLHttpRequest` calls. It extracts only user IDs, handles, counts and boolean follow fields, then sends those records to an isolated content script via same-origin messages. It makes no additional API calls.

Account records remain in tab memory, capped at 3,000 users with a five-minute TTL per field. Only display preferences persist in `chrome.storage.local`. There is no backend, telemetry or external upload.

Legacy `legacy.screen_name` and newer `core.screen_name` structures are supported; following counts use `friends_count`. Relationship fields accept explicit booleans only. Missing or null fields remain unknown.

The bridge compares readable `twid` / `ct0` cookies locally to detect session changes. Cookie values never cross the bridge. A change clears the cache and rejects stale responses. If the cookies cannot be read or a switch is not observable, refresh the tab after switching accounts.

See [Chrome content-script documentation](https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts) and [a user-schema migration example](https://github.com/fa0311/twitter-openapi/issues/95).

## Development

Node.js 22+:

```sh
npm test
```

Optional integration tests require Python 3, Playwright and Chromium:

```sh
python3 -m pip install playwright
python3 -m playwright install chromium
python3 -m http.server 8765 --bind 127.0.0.1
# In another terminal:
python3 tests/browser.py
```

These tests mock extension storage and X data. They cover parsing, TTL, late responses after account changes, recycled timeline nodes, settings persistence, display switches and localization. They do not prove live X compatibility.

Package the runtime files:

```sh
python3 package.py
```

Extract `dist/xx-extension-0.1.0.zip` before loading it in Chrome.

## Limitations

X can change its DOM and response schema. Previously loaded responses, Service Worker requests, WebSockets and initial cached state are not read. Missing fields are not fetched. Colors follow the system theme. MAIN-world scripts share a trust boundary with X page scripts; treat badges as auxiliary information.

## Contributing and licensing

Include versions and reproduction steps when reporting issues. Never attach cookies, tokens, private messages or complete authenticated responses. New features should use minimal permissions and include both languages.

No open-source license has been selected. XX is independent of X Corp. and is not endorsed by it.
