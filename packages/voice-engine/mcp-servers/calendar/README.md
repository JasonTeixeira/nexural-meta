# nexural-mcp-calendar

Reference MCP server for voice agents. SQLite-backed. ~200 lines. Fork it
as the template for any per-app MCP server (CRM, knowledge base,
ticketing, EHR — anything the voice persona needs to _do_).

## Tools

| Tool                                       | Purpose                      |
| ------------------------------------------ | ---------------------------- |
| `list_slots(day, duration_min)`            | Find free appointment starts |
| `book_slot(customer_name, starts_at, ...)` | Create a booking             |
| `cancel_booking(booking_id)`               | Cancel by ID                 |
| `list_my_bookings(customer_contact)`       | Lookup by phone/email        |

## Run

```bash
cd packages/voice-engine/mcp-servers/calendar
pip install -e .

# Stdio (for Claude Desktop / mcp clients):
calendar-mcp

# HTTP+SSE (for voice-engine personas pointing at it via URL):
calendar-mcp --http --port 7700
# → exposes http://localhost:7700/sse
```

## Wire it into a persona

```yaml
mcp_servers:
  - name: calendar
    url: http://localhost:7700/sse
```

`receptionist` and `sales_agent` are already wired (replace
`https://mcp.your-domain.com/calendar` with your real URL).

## Fork it for your own app

This server is a 4-file template:

```
src/calendar_mcp/
  __init__.py
  store.py    ← swap with your real backend (Cal.com, Google Calendar, internal API)
  server.py   ← MCP tool decorators; rename tools to match your domain
```

Rename to `mcp-servers/<your-domain>/`, swap `CalendarStore` for your
backend client, and you've got a per-app tool surface. The voice engine
never changes.

## License

MIT — pattern inspired by the ai-warehouse MCP server template
(https://github.com/JasonTeixeira/ai-warehouse, also MIT for code).
