# Site Discovery for Hoshimikan6490

## Purpose

Provide the main agent-facing discovery entry points for this site.

## Available Resources

- `/docs/api` for the human-readable overview
- `/.well-known/api-catalog` for RFC 9727 linkset discovery
- `/openapi.json` for the OpenAPI description
- `/.well-known/openid-configuration` for OAuth / OIDC discovery
- `/.well-known/oauth-protected-resource` for protected resource metadata
- `/.well-known/mcp/server-card.json` for MCP server discovery

## Notes

- Use `Accept: text/markdown` to request the Markdown representation of supported pages.
- The homepage advertises the discovery documents via RFC 8288 Link headers.
