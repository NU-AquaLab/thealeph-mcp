# The Aleph MCP Troubleshooting Guide

## Common Issues

### Installation Problems

#### "npm: command not found"
**Cause**: Node.js is not installed
**Solution**: 
```bash
# Install Node.js from https://nodejs.org/
# Or use package manager:
# macOS: brew install node
# Ubuntu: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs
```

#### "EACCES: permission denied" or "EPERM: operation not permitted"
**Cause**: npm permission issues
**Solution**:
```bash
# Option 1: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then reinstall
npm install -g https://github.com/NU-AquaLab/thealeph-mcp.git

# Option 2: Use sudo (not recommended, but works)
sudo npm install -g https://github.com/NU-AquaLab/thealeph-mcp.git
```

#### "Cannot find module"
**Cause**: Incomplete or corrupted installation
**Solution**:
```bash
# Clean reinstall
npm uninstall -g thealeph-mcp
npm cache clean --force
npm install -g thealeph-mcp
```

#### Package not found after installation
**Cause**: Installation path not in PATH
**Solution**:
```bash
# Check installation
npm list -g thealeph-mcp
which thealeph-mcp

# Add npm global bin to PATH if needed
echo 'export PATH=$(npm config get prefix)/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

#### Setup can't find The Aleph MCP installation
**Cause**: Non-standard npm installation or PATH issues
**Solution**:
```bash
# 1. Verify installation
npm list -g thealeph-mcp

# 2. Find where npm installs global packages
npm root -g
npm bin -g

# 3. Check if thealeph-mcp is in PATH
which thealeph-mcp  # Unix/macOS
where thealeph-mcp  # Windows

# 4. If not in PATH, add it:
export PATH="$(npm bin -g):$PATH"

# 5. Run setup again
thealeph-mcp --setup
```

### Claude Desktop Integration Issues

#### Claude doesn't see NetCores tools
**Diagnosis**:
```bash
# Check configuration exists
thealeph-mcp --config

# Validate JSON syntax
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq .
```

**Solutions**:
1. Run setup again: `thealeph-mcp --setup`
2. Restart Claude Desktop completely (quit and reopen)
3. Check config file permissions
4. Verify file location is correct for your OS

#### "MCP server disconnected" error
**Diagnosis**:
```bash
# Test MCP server directly
thealeph-mcp --test

# Check API connectivity
curl https://thealeph.ai/api/health
```

**Solutions**:
1. Restart Claude Desktop
2. Check network connectivity
3. Check for conflicting MCP servers

#### Tools listed but don't work
**Diagnosis**:
```bash
# Test API connection
thealeph-mcp --test-all

# Check specific tool
printf '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "thealeph_health_check", "arguments": {}}}\n' | thealeph-mcp
```

**Solutions**:
1. Check API server status
2. Verify network connectivity
3. Check for firewall/proxy issues

### Network and API Issues

#### Connection timeouts
**Symptoms**: "Connection failed" or timeout errors
**Solutions**:
```bash
# Test API directly
curl -m 10 https://thealeph.ai/api/health

# Configure timeout (if needed)
export NETCORES_TIMEOUT=60000
```

#### "API server error (500)"
**Cause**: Server-side issues
**Solutions**:
1. Wait and retry (temporary server issues)
2. Check API status page
3. Report if persistent

#### Data refresh failures
**Symptoms**: Refresh tools return errors
**Solutions**:
1. Check if you have permission to trigger updates
2. Try again later (may be rate limited)
3. Use read-only tools instead

### Platform-Specific Issues

#### macOS: Permission denied
```bash
# Fix permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Or use homebrew node
brew install node
```

#### Windows: Command not recognized
```cmd
# Add npm to PATH
set PATH=%PATH%;%APPDATA%\npm

# Or reinstall Node.js with PATH option enabled
```

#### Linux: Node version conflicts
```bash
# Use NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

## Diagnostic Commands

### System Information
```bash
# Check versions
node --version
npm --version
thealeph-mcp --version

# Check installation
which thealeph-mcp
npm list -g thealeph-mcp

# System info
uname -a  # Linux/macOS
systeminfo  # Windows
```

### Test Suite
```bash
# Run full diagnostics
thealeph-mcp --test-all

# Test specific components
thealeph-mcp --test           # API connection
thealeph-mcp --config         # Configuration
thealeph-mcp --help           # Command help
```

### MCP Protocol Testing
```bash
# Test MCP initialization
printf '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}\n' | thealeph-mcp

# List tools
printf '{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}\n' | thealeph-mcp
```

## Log Files and Debugging

### Claude Desktop Logs
**macOS**: `~/Library/Logs/Claude/`
**Windows**: `%LOCALAPPDATA%\Claude\logs\`
**Linux**: `~/.local/share/Claude/logs/`

### Debug Mode
```bash
# Enable debug output
DEBUG=thealeph-mcp thealeph-mcp --test

# Verbose testing
thealeph-mcp --test-all --verbose
```

### Manual API Testing
```bash
# Test all endpoints
curl https://thealeph.ai/api/health
curl https://thealeph.ai/api/summary
curl "https://thealeph.ai/api/trends/15169?ip_version=ipv4"
curl https://thealeph.ai/api/snapshots
```

## Performance Issues

### Slow response times
1. Check network latency to API server
2. Try alternative API endpoint
3. Increase timeout settings
4. Check for proxy/VPN interference

### Memory usage
1. Restart Claude Desktop
2. Check for memory leaks in logs
3. Update to latest version

## Getting Help

### Before Reporting Issues
1. Run `thealeph-mcp --test-all` and include output
2. Check system requirements (Node.js 18+)
3. Try alternative API server
4. Search existing issues

### Information to Include
- Operating system and version
- Node.js and npm versions
- The Aleph MCP version
- Complete error messages
- Steps to reproduce
- Output of diagnostic commands

### Support Channels
- GitHub Issues: Report bugs and feature requests
- API Status: Check server status pages
- Documentation: Review installation and usage guides

## Quick Fixes

### Reset Everything
```bash
# Complete reset
npm uninstall -g thealeph-mcp
rm -rf ~/.npm/_npx/*thealeph*
npm cache clean --force

# Reinstall
npm install -g thealeph-mcp
thealeph-mcp --setup
thealeph-mcp --test-all
```

### Alternative Installation
```bash
# Direct from tarball
curl -O https://thealeph.ai/static/downloads/thealeph-mcp-1.0.0.tgz
npm install -g ./thealeph-mcp-1.0.0.tgz
```

### Configuration Reset
```bash
# Backup current config
cp ~/Library/Application\ Support/Claude/claude_desktop_config.json claude_config_backup.json

# Reset configuration
thealeph-mcp --setup
```