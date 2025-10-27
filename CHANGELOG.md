# Changelog

All notable changes to The Aleph MCP will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-27

### 🎉 Initial Release

The Aleph MCP v1.0.0 - First public release providing network intelligence through MCP.

### Added

#### Core Infrastructure
- Model Context Protocol (MCP) server implementation using official SDK
- Cross-platform support (macOS, Windows, Linux)
- Interactive Claude Desktop configuration utility
- Comprehensive test suite (unit, integration, e2e)

#### API Client
- HTTP client with automatic retry and exponential backoff
- Configurable timeouts and retry attempts
- Error normalization for consistent error messages
- Support for custom API URLs via environment variable

#### Network Intelligence Tools (13 Total)

**Monitoring Tools (5)**
- `thealeph_health_check` - System health and operational status
- `thealeph_current_stats` - Current API usage statistics (1-30 days)
- `thealeph_daily_stats` - Statistics for specific date
- `thealeph_summary_stats` - Quick usage summary
- `thealeph_export_stats` - Export monitoring data (JSON/CSV)

**ASN Analysis Tools (5)**
- `thealeph_asn_classifications` - ASN classification data
- `thealeph_asn_regex` - PTR parsing regex patterns
- `thealeph_asn_hints` - Geographic and network hints
- `thealeph_asn_infrastructure_mapping` - Infrastructure location mapping
- `thealeph_asn_hint_mapping` - Hint-based location mapping

**PTR Query Tools (2)**
- `thealeph_query_ptr` - Single PTR record query with network intelligence
- `thealeph_batch_query_ptr` - Batch PTR queries (up to 100)

**Traceroute Tools (1)**
- `thealeph_traceroute_mapper` - Enrich traceroute with network intelligence

#### CLI Features
- `--setup` - Interactive Claude Desktop configuration
- `--test` - Test API connectivity
- `--test-all` - Run full test suite
- `--config` - Display current configuration
- `--help` - Show help information
- `--version` - Display version information
- `--api-url` - Override default API URL

#### Documentation
- Comprehensive README with installation and usage examples
- Detailed API documentation for all 13 tools
- CLAUDE.md for Claude Code integration
- Installation guide
- Troubleshooting guide
- Contributing guidelines

### Technical Details

#### Dependencies
- `@modelcontextprotocol/sdk` ^0.4.0 - Official MCP SDK
- `axios` ^1.6.0 - HTTP client
- `commander` ^11.0.0 - CLI framework
- `chalk` ^4.1.2 - Terminal styling
- `ora` ^5.4.1 - Loading spinners
- `inquirer` ^8.2.6 - Interactive prompts

#### API Integration
- Base URL: `https://thealeph.ai`
- Environment variable: `THEALEPH_API_URL`
- Timeout: 30 seconds (configurable)
- Retry attempts: 3 with exponential backoff

#### Platform Support
- Node.js >= 18.0.0
- Operating Systems: macOS, Windows, Linux
- Architectures: x64, arm64

### Configuration

Default configuration for Claude Desktop:
```json
{
  "mcpServers": {
    "thealeph": {
      "command": "thealeph-mcp"
    }
  }
}
```

### Notes

This is the initial release of The Aleph MCP, providing comprehensive network intelligence capabilities to LLMs through the Model Context Protocol. The project enables natural language querying of PTR records, ASN data, traceroute analysis, and network monitoring statistics.

[1.0.0]: https://github.com/NU-AquaLab/thealeph-mcp/releases/tag/v1.0.0
