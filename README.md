# The Aleph MCP

[![Node.js Version](https://img.shields.io/node/v/thealeph-mcp.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io/)

**The Aleph MCP** is a Model Context Protocol (MCP) server that provides LLMs with powerful network intelligence capabilities through The Aleph API. Connect Claude Desktop to real-time PTR records, ASN data, traceroute analysis, and network monitoring.

> 🌐 **Live API**: [thealeph.ai](https://thealeph.ai) | 📖 **Full Docs**: [API Documentation](https://thealeph.ai/docs)

## 🚀 Quick Installation

### Method 1: NPM Registry (Recommended)

```bash
# Once published to npm
npm install -g thealeph-mcp
thealeph-mcp --setup
```

### Method 2: Install from GitHub

```bash
# Install directly from GitHub repository
npm install -g https://github.com/NU-AquaLab/thealeph-mcp.git

# Setup Claude Desktop (interactive)
thealeph-mcp --setup

# Test everything works
thealeph-mcp --test-all
```

### Method 3: Clone and Install

```bash
# Clone the repository
git clone https://github.com/NU-AquaLab/thealeph-mcp.git
cd thealeph-mcp

# Install globally
npm install -g .

# Setup Claude Desktop
thealeph-mcp --setup
```

## ✅ Verify Installation

After installation, restart Claude Desktop and ask:

> **"What tools do you have available?"**

You should see 13 Aleph tools listed! Then try:

> **"Check the health of The Aleph system"**
>
> **"Query the PTR record for IP 8.8.8.8"**
>
> **"What are the regex patterns for ASN 15169?"**

## 🛠️ Features

### 🌐 Network Intelligence Tools

The Aleph MCP provides 13 powerful tools for network analysis:

#### Monitoring Tools (5)
1. **Health Check** - System status and availability
2. **Current Statistics** - API usage stats for last N days
3. **Daily Statistics** - Statistics for specific date
4. **Summary Statistics** - Quick usage summary
5. **Export Statistics** - Export monitoring data (JSON/CSV)

#### ASN Analysis Tools (5)
6. **ASN Classifications** - Classification data for ASNs
7. **ASN Regex Patterns** - PTR parsing patterns for ASNs
8. **ASN Hints** - Geographic and network hints
9. **ASN Infrastructure Mapping** - Infrastructure location mapping
10. **ASN Hint Mapping** - Hint-based location mapping

#### PTR Query Tools (2)
11. **Query PTR** - Single PTR record query with network intelligence
12. **Batch Query PTR** - Multiple PTR queries (up to 100)

#### Traceroute Tools (1)
13. **Traceroute Mapper** - Enrich traceroute with network intelligence

### 📊 Data Sources

- **PTR Records**: Reverse DNS lookups with geographic intelligence
- **ASN Data**: Autonomous System classifications and patterns
- **Traceroute Analysis**: Hop-by-hop network intelligence
- **Monitoring**: Real-time API usage statistics
- **API**: Production deployment at [thealeph.ai](https://thealeph.ai)

### 🔧 CLI Commands

```bash
# Start MCP server (for Claude Desktop)
thealeph-mcp

# Interactive Claude Desktop setup
thealeph-mcp --setup

# Test API connection
thealeph-mcp --test

# Run full test suite
thealeph-mcp --test-all

# Show current configuration
thealeph-mcp --config

# Show help
thealeph-mcp --help
```

## 📋 Requirements

- **Node.js**: 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: Latest version (comes with Node.js)
- **Claude Desktop**: Latest version with MCP support
- **Network**: Internet connection to reach The Aleph API

### Check Requirements

```bash
# Verify you have the right versions
node --version  # Should be v18.0.0+
npm --version   # Any recent version
which thealeph-mcp  # Should show path after installation
```

## 🔧 Configuration & Setup

### Automatic Configuration (Recommended)

```bash
# Interactive setup - detects your system automatically
thealeph-mcp --setup
```

This command will:
- ✅ Automatically locate your The Aleph MCP installation
- ✅ Verify the installation is working correctly
- ✅ Detect your operating system (macOS/Windows/Linux)
- ✅ Find your Claude Desktop configuration file
- ✅ Configure Claude Desktop with the correct absolute path
- ✅ Show you exactly where everything was installed

### Manual Configuration

If automatic setup doesn't work:

#### 1. Find Your Claude Desktop Config File

| OS | Location |
|---|---|
| **macOS** | `~/Library/Application\ Support/Claude/claude_desktop_config.json` |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

#### 2. Add The Aleph MCP Configuration

Add the following configuration to your Claude Desktop config file:

```json
{
  "mcpServers": {
    "thealeph": {
      "command": "thealeph-mcp"
    }
  }
}
```

This uses the default Aleph server at `https://thealeph.ai`.

### Environment Variables

```bash
# Set custom API URL (optional)
export THEALEPH_API_URL=https://thealeph.ai

# Windows PowerShell:
$env:THEALEPH_API_URL="https://thealeph.ai"
```

## 📖 Usage Examples

Once configured, you can use The Aleph tools in Claude Desktop:

### Basic Health Check

> "Check the health of The Aleph system"

### PTR Record Queries

> "Query the PTR record for IP address 8.8.8.8"
>
> "What network information can you find for dns.google?"

### Batch PTR Queries

> "Query PTR records for these IPs: 8.8.8.8, 1.1.1.1, and 9.9.9.9"

### ASN Analysis

> "What are the regex patterns used by Google's ASN 15169?"
>
> "Show me the infrastructure mapping for ASN 15169"

### Traceroute Analysis

> "Here's my traceroute output, enrich it with network intelligence: [paste traceroute]"

### Network Research

> "What geographic hints are available for Cloudflare's ASN 13335?"
>
> "Compare the classifications between ASN 15169 (Google) and ASN 32934 (Meta)"

## 🐛 Troubleshooting

### Installation Issues

| Problem | Solution |
|---------|----------|
| **"npm: command not found"** | Install Node.js from [nodejs.org](https://nodejs.org/) |
| **"EACCES: permission denied"** | Use `npm config set prefix ~/.npm-global` and update PATH |
| **"Cannot find module"** | Reinstall: `npm uninstall -g thealeph-mcp && npm install -g https://github.com/NU-AquaLab/thealeph-mcp.git` |
| **Package not found after install** | Check npm global path: `npm root -g` |

### Claude Desktop Issues

| Problem | Diagnosis | Solution |
|---------|-----------|----------|
| **Claude doesn't see Aleph tools** | Config file issue | Run `thealeph-mcp --setup` again |
| **"MCP server disconnected"** | Server crash | Check logs, restart Claude Desktop |
| **Tools listed but don't work** | API connectivity | Test with `thealeph-mcp --test` |
| **Setup command hangs** | Permission/path issue | Run with `sudo` or fix npm permissions |

### Debug Commands

```bash
# Check what's actually installed
npm list -g thealeph-mcp

# Find installation path
which thealeph-mcp

# Test server directly
node $(npm root -g)/thealeph-mcp/src/server.js --version

# Validate Claude Desktop config
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq .

# Test API server
curl https://thealeph.ai/monitoring/health
```

### Log Files

Check these locations for error logs:

| OS | Log Location |
|---|---|
| **macOS** | `~/Library/Logs/Claude/` |
| **Windows** | `%LOCALAPPDATA%\Claude\logs\` |
| **Linux** | `~/.local/share/Claude/logs/` |

For more detailed troubleshooting, see [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

## 📚 Related Projects

- **The Aleph Web App**: [thealeph.ai](https://thealeph.ai)
- **The Aleph API Docs**: [API Documentation](https://thealeph.ai/docs)
- **Model Context Protocol**: [MCP Specification](https://modelcontextprotocol.io/)


---

**The Aleph MCP** - Bringing network intelligence to conversational AI 🌐✨
