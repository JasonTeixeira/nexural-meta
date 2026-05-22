# @nexural/forge-emit

## 0.1.0

- Initial release. Phase 6.5 deliverable per ADR-0011.
- Pure render path (I/O-free) + disk-write helper.
- Handlebars-subset renderer: `{{ var }}`, default values, `{{# if }}`, `{{# unless }}`.
- Safety floors: unresolved vars, path traversal, duplicate paths, secret leak detection, binary integrity.
