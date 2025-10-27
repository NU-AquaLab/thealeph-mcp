# The Aleph MCP API Documentation

## Overview

The Aleph MCP provides 13 tools for network intelligence analysis through the Model Context Protocol. Each tool communicates with The Aleph REST API to retrieve PTR records, ASN data, traceroute information, and monitoring statistics.

## Tool Categories

### Monitoring Tools (5)
Health monitoring and API usage statistics

### ASN Analysis Tools (5)
Autonomous System Number data and intelligence

### PTR Query Tools (2)
Reverse DNS lookups and network intelligence

### Traceroute Tools (1)
Traceroute enrichment with network data

---

## Monitoring Tools

### 1. Health Check (`thealeph_health_check`)

**Description**: Check the health and operational status of The Aleph API

**Parameters**: None

**Returns**: System status and health information

**Example Usage**:
```javascript
{
  "name": "thealeph_health_check",
  "arguments": {}
}
```

**Example Response**:
```
🏥 The Aleph Health Check ✅

**Status:** healthy
**Message:** System operational

The Aleph API is operational and ready.
```

---

### 2. Current Statistics (`thealeph_current_stats`)

**Description**: Get current API usage statistics for the last N days

**Parameters**:
- `days` (integer, optional): Number of days to retrieve statistics for (1-30, default: 1)

**Returns**: Current API usage statistics

**Example Usage**:
```javascript
{
  "name": "thealeph_current_stats",
  "arguments": {
    "days": 7
  }
}
```

---

### 3. Daily Statistics (`thealeph_daily_stats`)

**Description**: Get API usage statistics for a specific date

**Parameters**:
- `date` (string, required): Date in YYYY-MM-DD format

**Returns**: Statistics for the specified date

**Example Usage**:
```javascript
{
  "name": "thealeph_daily_stats",
  "arguments": {
    "date": "2024-10-27"
  }
}
```

---

### 4. Summary Statistics (`thealeph_summary_stats`)

**Description**: Get a quick summary of API usage statistics

**Parameters**: None

**Returns**: Summary of overall API usage

**Example Usage**:
```javascript
{
  "name": "thealeph_summary_stats",
  "arguments": {}
}
```

---

### 5. Export Statistics (`thealeph_export_stats`)

**Description**: Export all monitoring data in specified format

**Parameters**:
- `format` (string, optional): Export format - "json" or "csv" (default: "json")

**Returns**: Exported monitoring data

**Example Usage**:
```javascript
{
  "name": "thealeph_export_stats",
  "arguments": {
    "format": "json"
  }
}
```

---

## ASN Analysis Tools

### 6. ASN Classifications (`thealeph_asn_classifications`)

**Description**: Get classification information for a specific ASN

**Parameters**:
- `asn` (string, required): Autonomous System Number (e.g., "15169" for Google)

**Returns**: Classification data for the ASN

**Example Usage**:
```javascript
{
  "name": "thealeph_asn_classifications",
  "arguments": {
    "asn": "15169"
  }
}
```

---

### 7. ASN Regex Patterns (`thealeph_asn_regex`)

**Description**: Get regex patterns associated with an ASN for PTR record parsing

**Parameters**:
- `asn` (string, required): Autonomous System Number

**Returns**: Regex patterns used for parsing PTR records from this ASN

**Example Usage**:
```javascript
{
  "name": "thealeph_asn_regex",
  "arguments": {
    "asn": "15169"
  }
}
```

---

### 8. ASN Hints (`thealeph_asn_hints`)

**Description**: Get geographic and network hints for an ASN

**Parameters**:
- `asn` (string, required): Autonomous System Number

**Returns**: Geographic and network hints

**Example Usage**:
```javascript
{
  "name": "thealeph_asn_hints",
  "arguments": {
    "asn": "32934"
  }
}
```

---

### 9. ASN Infrastructure Mapping (`thealeph_asn_infrastructure_mapping`)

**Description**: Map infrastructure locations for an ASN

**Parameters**:
- `asn` (string, required): Autonomous System Number

**Returns**: Array of location information with infrastructure details

**Example Usage**:
```javascript
{
  "name": "thealeph_asn_infrastructure_mapping",
  "arguments": {
    "asn": "13335"
  }
}
```

---

### 10. ASN Hint Mapping (`thealeph_asn_hint_mapping`)

**Description**: Get hint-based location mapping for an ASN

**Parameters**:
- `asn` (string, required): Autonomous System Number

**Returns**: Array of locations derived from hint analysis

**Example Usage**:
```javascript
{
  "name": "thealeph_asn_hint_mapping",
  "arguments": {
    "asn": "15169"
  }
}
```

---

## PTR Query Tools

### 11. Query PTR Record (`thealeph_query_ptr`)

**Description**: Query reverse DNS (PTR) records and retrieve network intelligence including ASN, location, and geo hints

**Parameters** (at least one required):
- `ptr_record` (string, optional): PTR record hostname to query
- `ip` (string, optional): IP address to query
- `asn` (integer, optional): ASN number to query

**Returns**: PTR query results with network intelligence

**Example Usage**:
```javascript
{
  "name": "thealeph_query_ptr",
  "arguments": {
    "ip": "8.8.8.8"
  }
}
```

**Example Response**:
```
🔎 PTR Query Results

**IP Address:** 8.8.8.8
**PTR Record:** dns.google
**ASN:** 15169
**Location Info:** {geographic data}
**Regex Pattern:** `pattern`
**Geo Hint:** {hint data}
```

---

### 12. Batch Query PTR Records (`thealeph_batch_query_ptr`)

**Description**: Query multiple PTR records in a single batch request

**Parameters**:
- `queries` (array, required): Array of query objects (1-100 queries)
  - Each query object can contain: `ptr_record`, `ip`, and/or `asn`

**Returns**: Array of PTR query results

**Example Usage**:
```javascript
{
  "name": "thealeph_batch_query_ptr",
  "arguments": {
    "queries": [
      {"ip": "8.8.8.8"},
      {"ip": "1.1.1.1"},
      {"ptr_record": "dns.google"}
    ]
  }
}
```

---

## Traceroute Tools

### 13. Traceroute Mapper (`thealeph_traceroute_mapper`)

**Description**: Enrich traceroute hops with network intelligence including ASN, PTR records, and geographic locations

**Parameters**:
- `traceroute` (string, required): Traceroute output as a string
- `mode` (string, optional): Traceroute format mode - "string" or "RIPE" (default: "string")

**Returns**: Enriched traceroute data with network intelligence for each hop

**Example Usage**:
```javascript
{
  "name": "thealeph_traceroute_mapper",
  "arguments": {
    "traceroute": "1  192.168.1.1\n2  10.0.0.1\n3  8.8.8.8",
    "mode": "string"
  }
}
```

**Example Response**:
```
🛤️ Traceroute Mapping Results (string mode)

**Hop 1:**
  - IP: 192.168.1.1
  - ASN: null
  - PTR: router.local
  - Location: null

**Hop 2:**
  - IP: 10.0.0.1
  - ASN: null
  - PTR: null
  - Location: null

**Hop 3:**
  - IP: 8.8.8.8
  - ASN: 15169
  - PTR: dns.google
  - Location: {location data}
```

---

## API Endpoints

The Aleph MCP communicates with these REST API endpoints:

### Monitoring Endpoints
- `GET /monitoring/health` - System health check
- `GET /monitoring/stats/current` - Current statistics
- `GET /monitoring/stats/daily/{date}` - Daily statistics
- `GET /monitoring/stats/summary` - Summary statistics
- `GET /monitoring/stats/export` - Export monitoring data

### ASN Endpoints
- `GET /api/asn/{asn}/classifications` - ASN classifications
- `GET /api/asn/{asn}/regex` - ASN regex patterns
- `GET /api/asn/{asn}/hints` - ASN hints
- `GET /api/asn/{asn}/infrastructure_mapping` - Infrastructure mapping
- `GET /api/asn/{asn}/hint_mapping` - Hint mapping

### PTR Query Endpoints
- `POST /api/query` - Single PTR query
- `POST /api/batch_query` - Batch PTR queries

### Traceroute Endpoint
- `POST /api/traceroute_mapper` - Traceroute mapping

---

## Configuration

### API Server

**Default**: `https://thealeph.ai`

### Environment Variables

- `THEALEPH_API_URL`: Override default API URL

### Error Handling

All tools include comprehensive error handling:
- Network connectivity issues
- API server errors
- Invalid parameters
- Timeout handling (30s default)
- Retry logic with exponential backoff (3 attempts)

---

## Data Sources

- **PTR Records**: Reverse DNS lookups with geographic intelligence
- **ASN Data**: Autonomous System classifications and patterns
- **Traceroute Intelligence**: Hop-by-hop network analysis
- **Monitoring**: Real-time API usage statistics

---

## Schema Validation

All tools use JSON Schema for parameter validation:
- Required vs optional parameters
- Type checking (integer, string, array)
- Format validation (date patterns, enum values)
- Array size limits (batch queries limited to 100)

---

## Usage Tips

1. **ASN Queries**: Always provide ASN as a string, not integer (except in PTR queries)
2. **PTR Queries**: Can query by ptr_record, ip, or asn - at least one required
3. **Batch Queries**: Limit to 100 queries per batch for optimal performance
4. **Traceroute Modes**: Use "string" for standard output, "RIPE" for RIPE Atlas format
5. **Date Formats**: Always use YYYY-MM-DD format for date parameters
6. **Statistics**: Use appropriate time ranges (1-30 days) for current stats
