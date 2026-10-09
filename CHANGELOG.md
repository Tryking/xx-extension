# Changelog

## 0.1.2 — 2026-10-10

- Read follower and following counts from X's current `relationship_counts` fields, with legacy fallback.
- Fix unknown counts after refreshing the home timeline; verify repeated reloads in signed-in Chrome.
- Add regression coverage for current fields, zero counts, invalid/missing counts and repeated manifest-test reloads.

## 0.1.1 — 2026-10-10

- Fix Chrome's cross-world script-path deduplication by bundling the MAIN-world bridge separately.
- Add a real Manifest V3 extension test with synthetic page responses.
- Verify relationship badges in a signed-in X home timeline. The current count schema was still unsupported in this version.
- Make English the default README with a Simplified Chinese translation; publish the repository and verify the developer contact email.

## 0.1.0 — 2026-10-10

- Initial XX Manifest V3 prototype for X timelines.
- Passive user-data extraction from fetch and XMLHttpRequest responses.
- Follower/following counts and explicit unknown follow relationships.
- English and Simplified Chinese settings, popup and live preview.
- Independent display switches, position and number formatting.
- Per-field cache expiration and observed-session reset.
- Core regression tests and synthetic browser integration tests.

The initial version's live signed-in compatibility was unverified.
