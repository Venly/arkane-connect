# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 2.0.0
### Added
- Redesign login flow + new UI
- Add `options.authenticationOptions.closePopup` option. If set to false, Venly popup will be kept open after authenticating.
  - For cases when you need to perform an action immediately after authenticating (such as signing a message)

### Changed
- **BREAKING:** All types/objects are now imported directly from `@venly/connect` instead of `@venly/connect/dist/src`
- **BREAKING:** Change filepath for head script tags
  - To use with npm install: `<script src="/node_modules/@venly/connect/umd/index.js"></script>`
  - To use directly from a CDN: `<script src="https://unpkg.com/@venly/connect/umd/index.js"></script>`

### Removed
- 

### Fixed
- Fix `readContract` method to use the correct `Content-Type` header
