# The Aleph MCP Installation Guide

A complete guide to installing and configuring the NetCores Model Context Protocol (MCP) package for Claude Desktop.

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
  - [Method 1: Download from Server](#method-1-download-from-server)
  - [Method 2: NPM Registry](#method-2-npm-registry)
  - [Method 3: Build from Source](#method-3-build-from-source)
- [Configuration](#configuration)
  - [Automatic Setup](#automatic-setup)
  - [Manual Configuration](#manual-configuration)
  - [Environment Variables](#environment-variables)
- [Testing Installation](#testing-installation)
- [Claude Desktop Integration](#claude-desktop-integration)
- [Troubleshooting](#troubleshooting)
- [Uninstallation](#uninstallation)

## Quick Start

```bash
# Install from GitHub
npm install -g https://github.com/NU-AquaLab/thealeph-mcp.git

# Configure Claude Desktop
thealeph-mcp --setup

# Test installation
thealeph-mcp --test
```

## Prerequisites

### System Requirements

- **Node.js**: Version 18.0.0 or higher
- **npm**: Latest version (comes with Node.js)
- **Operating System**: macOS, Windows, or Linux
- **Claude Desktop**: Latest version with MCP support

### Check Prerequisites

```bash
# Check Node.js version
node --version  # Should be v18.0.0 or higher

# Check npm version
npm --version

# Check if Claude Desktop is installed
# macOS
ls ~/Library/Application\ Support/Claude/

# Windows
dir %APPDATA%\Claude\

# Linux
ls ~/.config/Claude/
```

### Installing Node.js

If you don't have Node.js installed:

**macOS (using Homebrew):**
```bash
brew install node
```

**Windows:**
Download from [nodejs.org](https://nodejs.org/)

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Installation Methods

### Method 1: Install from GitHub

**Recommended for most users**

```bash
# Install directly from GitHub repository
npm install -g https://github.com/NU-AquaLab/thealeph-mcp.git

# Verify installation
thealeph-mcp --version
# Output: The Aleph MCP Server v1.0.0
```

### Method 2: Clone and Install

**For developers or custom modifications**

```bash
# Clone the repository
git clone https://github.com/NU-AquaLab/thealeph-mcp.git
cd thealeph-mcp

# Install dependencies
npm install

# Install globally
npm install -g .

# Verify installation
thealeph-mcp --version
```

### Method 3: NPM Registry

**Coming soon - Once published to npm registry**

```bash
# Direct installation from npm
npm install -g thealeph-mcp

# Or using npx (no installation)
npx thealeph-mcp --help
```


## Configuration

### Automatic Setup

The easiest way to configure Claude Desktop:

```bash
# Run interactive setup
thealeph-mcp --setup
```

This will:
1. Detect your operating system
2. Find your Claude Desktop configuration file
3. Add The Aleph MCP to the configuration
4. Validate the setup

**Example setup session:**
```
🔧 The Aleph MCP Setup for Claude Desktop

⚠️  No existing Claude Desktop config found.
? Would you like to create a new Claude Desktop config? Yes

✅ The Aleph MCP successfully configured for Claude Desktop!
📍 Configuration saved to: ~/Library/Application Support/Claude/claude_desktop_config.json
🌐 API URL: https://thealeph.ai
```

### Manual Configuration

If automatic setup doesn't work or you prefer manual configuration:

#### 1. Find Configuration File

**macOS:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```bash
~/.config/Claude/claude_desktop_config.json
```

#### 2. Create/Edit Configuration

Create the directory if it doesn't exist:

**macOS:**
```bash
mkdir -p ~/Library/Application\ Support/Claude
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Force -Path "$env:APPDATA\Claude"
```

**Linux:**
```bash
mkdir -p ~/.config/Claude
```

#### 3. Add Configuration

Edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "thealeph": {
      "command": "thealeph-mcp"
    }
  }
}
```

For custom API server:
```json
{
  "mcpServers": {
    "thealeph": {
      "command": "thealeph-mcp",
      "env": {
        "THEALEPH_API_URL": "https://your-server.com:8889"
      }
    }
  }
}
```

### Environment Variables

Configure The Aleph MCP behavior:

```bash
# Set custom API URL (default: https://thealeph.ai)
export THEALEPH_API_URL=https://your-custom-server.com

# For Windows:
set THEALEPH_API_URL=https://your-custom-server.com
```

## Testing Installation

### 1. Test CLI Commands

```bash
# Check version
thealeph-mcp --version
# Expected: The Aleph MCP Server v1.0.0

# Test API connection
thealeph-mcp --test
# Expected:
# Testing NetCores API connection...
# ✅ Connection successful!
#    URL: https://thealeph.ai
#    Status: healthy
#    Version: 0.1.0
#    Data Status: available

# Run full test suite
thealeph-mcp --test-all
# Expected: All 8 tools tested with 100% success rate

# Show help
thealeph-mcp --help

# Check configuration
thealeph-mcp --config
```

### 2. Test MCP Protocol

```bash
# Test MCP initialization
printf '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}\n' | thealeph-mcp

# Expected: JSON response with server capabilities
```

### 3. Verify Global Installation

```bash
# Check installation location
which thealeph-mcp

# Check npm global packages
npm list -g thealeph-mcp
```

## Claude Desktop Integration

### 1. Restart Claude Desktop

After configuration:

1. **Completely quit Claude Desktop** (not just close the window)
   - macOS: Cmd+Q or Claude Desktop → Quit
   - Windows: File → Exit or system tray → Exit
   - Linux: File → Quit

2. **Wait 5 seconds**

3. **Start Claude Desktop again**

### 2. Verify MCP Connection

In Claude Desktop, ask:

> "What tools do you have available?"

You should see NetCores tools listed among available tools.

### 3. Test NetCores Tools

Try these commands in Claude:

> "Check the health of the NetCores system"

> "What network data is available in NetCores?"

> "Analyze the k-core trends for Google's ASN 15169"

> "Compare network centrality between ASNs 15169, 32934, and 13335"

## Troubleshooting

### Installation Issues

**"npm: command not found"**
- Install Node.js first (see Prerequisites)

**"EACCES: permission denied"**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**"Cannot find module"**
```bash
# Reinstall
npm uninstall -g thealeph-mcp
npm cache clean --force
npm install -g ./thealeph-mcp-1.0.0.tgz
```

### Claude Desktop Issues

**Claude doesn't see NetCores tools:**

1. Check configuration file exists and is valid JSON:
```bash
# Validate JSON
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq .
```

2. Check MCP logs:
```bash
# View logs (location varies by OS)
tail -f ~/Library/Logs/Claude/mcp-server-thealeph.log
```

3. Test MCP server directly:
```bash
thealeph-mcp --test
```

**"MCP server disconnected"**

1. Check API connectivity:
```bash
curl https://thealeph.ai/api/health
```

2. Restart Claude Desktop completely

3. Check for conflicting MCP servers in config

### Common Error Messages

**"Failed to start The Aleph MCP Server"**
- Check Node.js version: `node --version`
- Verify installation: `npm list -g thealeph-mcp`
- Check for port conflicts

**"Connection failed"**
- Verify network connectivity
- Check if API server is accessible
- Try alternative API server

**"Transport closed unexpectedly"**
- Usually indicates a crash - check logs
- Reinstall the package
- Report issue with log details

### Debug Mode

For detailed debugging:

```bash
# Check what's installed
ls -la $(npm root -g)/thealeph-mcp/

# Test server directly
node $(npm root -g)/thealeph-mcp/src/server.js --test

# Monitor logs during usage
tail -f ~/path/to/claude/logs/mcp-server-thealeph.log
```

## Uninstallation

### Remove The Aleph MCP

```bash
# 1. Uninstall package
npm uninstall -g thealeph-mcp

# 2. Remove from Claude Desktop config
# Either edit the config file and remove the "thealeph" section
# Or use the setup tool:
thealeph-mcp --setup
# Then choose to remove configuration

# 3. Clean up cache (optional)
npm cache clean --force
```

### Complete Cleanup

```bash
# Remove all traces
npm uninstall -g thealeph-mcp
rm -rf ~/.npm/_npx/*thealeph*
rm -rf $(npm root -g)/thealeph-mcp

# Remove from Claude config manually
# Edit claude_desktop_config.json and remove the "thealeph" section
```

## Support

### Getting Help

1. **Check documentation**: https://thealeph.ai/mcp-docs
2. **API status**: https://thealeph.ai/api/health
3. **Run diagnostics**: `thealeph-mcp --test-all`

### Reporting Issues

When reporting issues, include:

1. **System information**:
```bash
thealeph-mcp --version
node --version
npm --version
# Operating system and version
```

2. **Error messages** (full output)

3. **Log files** (if available)

4. **Steps to reproduce**

### Additional Resources

- **NetCores Web Interface**: https://thealeph.ai
- **API Documentation**: https://thealeph.ai/api-docs
- **MCP Documentation**: https://thealeph.ai/mcp-docs
- **CAIDA AS Relationships**: https://www.caida.org/catalog/datasets/as-relationships/

---

## Quick Reference Card

```bash
# Installation
npm install -g https://github.com/NU-AquaLab/thealeph-mcp.git

# Setup
thealeph-mcp --setup       # Interactive Claude Desktop setup
thealeph-mcp --test        # Test API connection
thealeph-mcp --test-all    # Run full test suite
thealeph-mcp --config      # Show current config
thealeph-mcp --help        # Show all commands

# Claude Desktop Config Location
# macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
# Windows: %APPDATA%\Claude\claude_desktop_config.json  
# Linux: ~/.config/Claude/claude_desktop_config.json

# Troubleshooting
npm list -g thealeph-mcp   # Check installation
which thealeph-mcp         # Find installation path
curl https://thealeph.ai/api/health  # Test API
```

---

*The Aleph MCP - Bringing Internet topology analysis to conversational AI* 🌐✨