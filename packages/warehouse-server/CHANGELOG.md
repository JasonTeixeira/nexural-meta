# @nexural/warehouse-server

## 1.0.0

- Initial release. Phase 11.1 deliverable per ADR-0012 §5 (federation MCP layer).
- Generic MCP stdio server for any warehouse — single binary, configured by `--root` arg.
- 5 tools: `warehouse_manifest`, `warehouse_list_documents`, `warehouse_read_document`, `warehouse_list_templates`, `warehouse_read_template`.
- Document reads return content wrapped in `<warehouse_content>` envelope (ADR-0008 §1 prompt-injection defense).
