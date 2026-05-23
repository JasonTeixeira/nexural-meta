# @nexural/warehouse-server

Generic MCP stdio server for any Nexural warehouse. Phase 11.1 deliverable per ADR-0012 §5.

## What it does

A single binary (`nexural-warehouse-server`) that serves any warehouse directory as an MCP server. Wire it into your MCP client config (editor, agent runtime, the federation router) to query warehouse content over the standard protocol.

## Usage

```bash
nexural-warehouse-server --root warehouses/auth
```

Or as a binary entry in an MCP client config:

```json
{
  "mcpServers": {
    "nexural-auth": {
      "command": "nexural-warehouse-server",
      "args": ["--root", "/abs/path/to/warehouses/auth"]
    }
  }
}
```

## Tools exposed

| Tool                       | Args        | Returns                                                               |
| -------------------------- | ----------- | --------------------------------------------------------------------- |
| `warehouse_manifest`       | none        | The full validated `manifest.yaml` as JSON                            |
| `warehouse_list_documents` | none        | Array of `{id, title, audience, tags, path}` for every authored doc   |
| `warehouse_read_document`  | `{id}`      | Document body wrapped in `<warehouse_content>` envelope (ADR-0008 §1) |
| `warehouse_list_templates` | `{recipe?}` | Template metadata; optionally filtered by recipe consumer             |
| `warehouse_read_template`  | `{id}`      | Raw template body (unrendered)                                        |

## Safety

Document reads return content wrapped in `<warehouse_content>` envelope tags per ADR-0008 §1. Synthesis layers consuming this tool inherit the prompt-injection defense for free — no need to wrap downstream.

## License

MIT.
