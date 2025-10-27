/**
 * The Aleph MCP Tools Implementation
 * Implements all 13 network intelligence tools for MCP
 */

const TheAlephAPIClient = require('./client');

class TheAlephTools {
  constructor(apiUrl = process.env.THEALEPH_API_URL || 'https://thealeph.ai') {
    this.client = new TheAlephAPIClient(apiUrl);
  }

  /**
   * Get all tool definitions for MCP server
   */
  getToolDefinitions() {
    return [
      {
        name: 'thealeph_health_check',
        description: 'Check the health and operational status of The Aleph API',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'thealeph_current_stats',
        description: 'Get current API usage statistics for the last N days',
        inputSchema: {
          type: 'object',
          properties: {
            days: {
              type: 'integer',
              description: 'Number of days to retrieve statistics for (1-30)',
              minimum: 1,
              maximum: 30,
              default: 1
            }
          },
          required: []
        }
      },
      {
        name: 'thealeph_daily_stats',
        description: 'Get API usage statistics for a specific date',
        inputSchema: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'Date in YYYY-MM-DD format',
              pattern: '^\\d{4}-\\d{2}-\\d{2}$'
            }
          },
          required: ['date']
        }
      },
      {
        name: 'thealeph_summary_stats',
        description: 'Get a quick summary of API usage statistics',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'thealeph_export_stats',
        description: 'Export all monitoring data in specified format',
        inputSchema: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              description: 'Export format',
              enum: ['json', 'csv'],
              default: 'json'
            }
          },
          required: []
        }
      },
      {
        name: 'thealeph_asn_classifications',
        description: 'Get classification information for a specific ASN',
        inputSchema: {
          type: 'object',
          properties: {
            asn: {
              type: 'string',
              description: 'Autonomous System Number (e.g., "15169" for Google)'
            }
          },
          required: ['asn']
        }
      },
      {
        name: 'thealeph_asn_regex',
        description: 'Get regex patterns associated with an ASN for PTR record parsing',
        inputSchema: {
          type: 'object',
          properties: {
            asn: {
              type: 'string',
              description: 'Autonomous System Number'
            }
          },
          required: ['asn']
        }
      },
      {
        name: 'thealeph_asn_hints',
        description: 'Get geographic and network hints for an ASN',
        inputSchema: {
          type: 'object',
          properties: {
            asn: {
              type: 'string',
              description: 'Autonomous System Number'
            }
          },
          required: ['asn']
        }
      },
      {
        name: 'thealeph_asn_infrastructure_mapping',
        description: 'Map infrastructure locations for an ASN',
        inputSchema: {
          type: 'object',
          properties: {
            asn: {
              type: 'string',
              description: 'Autonomous System Number'
            }
          },
          required: ['asn']
        }
      },
      {
        name: 'thealeph_asn_hint_mapping',
        description: 'Get hint-based location mapping for an ASN',
        inputSchema: {
          type: 'object',
          properties: {
            asn: {
              type: 'string',
              description: 'Autonomous System Number'
            }
          },
          required: ['asn']
        }
      },
      {
        name: 'thealeph_query_ptr',
        description: 'Query reverse DNS (PTR) records and retrieve network intelligence including ASN, location, and geo hints',
        inputSchema: {
          type: 'object',
          properties: {
            ptr_record: {
              type: 'string',
              description: 'PTR record hostname to query'
            },
            ip: {
              type: 'string',
              description: 'IP address to query'
            },
            asn: {
              type: 'integer',
              description: 'ASN number to query'
            }
          },
          required: []
        }
      },
      {
        name: 'thealeph_batch_query_ptr',
        description: 'Query multiple PTR records in a single batch request',
        inputSchema: {
          type: 'object',
          properties: {
            queries: {
              type: 'array',
              description: 'Array of query objects, each with optional ptr_record, ip, and/or asn',
              items: {
                type: 'object',
                properties: {
                  ptr_record: { type: 'string' },
                  ip: { type: 'string' },
                  asn: { type: 'integer' }
                }
              },
              minItems: 1,
              maxItems: 100
            }
          },
          required: ['queries']
        }
      },
      {
        name: 'thealeph_traceroute_mapper',
        description: 'Enrich traceroute hops with network intelligence including ASN, PTR records, and geographic locations',
        inputSchema: {
          type: 'object',
          properties: {
            traceroute: {
              type: 'string',
              description: 'Traceroute output as a string'
            },
            mode: {
              type: 'string',
              description: 'Traceroute format mode',
              enum: ['string', 'RIPE'],
              default: 'string'
            }
          },
          required: ['traceroute']
        }
      }
    ];
  }

  /**
   * Execute a tool by name with parameters
   */
  async executeTool(toolName, params = {}) {
    switch (toolName) {
      case 'thealeph_health_check':
        return this.healthCheck(params);
      case 'thealeph_current_stats':
        return this.currentStats(params);
      case 'thealeph_daily_stats':
        return this.dailyStats(params);
      case 'thealeph_summary_stats':
        return this.summaryStats(params);
      case 'thealeph_export_stats':
        return this.exportStats(params);
      case 'thealeph_asn_classifications':
        return this.asnClassifications(params);
      case 'thealeph_asn_regex':
        return this.asnRegex(params);
      case 'thealeph_asn_hints':
        return this.asnHints(params);
      case 'thealeph_asn_infrastructure_mapping':
        return this.asnInfrastructureMapping(params);
      case 'thealeph_asn_hint_mapping':
        return this.asnHintMapping(params);
      case 'thealeph_query_ptr':
        return this.queryPTR(params);
      case 'thealeph_batch_query_ptr':
        return this.batchQueryPTR(params);
      case 'thealeph_traceroute_mapper':
        return this.tracerouteMapper(params);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  /**
   * Health Check Tool
   */
  async healthCheck(params) {
    try {
      const result = await this.client.healthCheck();

      const statusEmoji = result.status === 'healthy' || result.status === 'ok' ? '✅' : '❌';

      return `🏥 The Aleph Health Check ${statusEmoji}

**Status:** ${result.status || 'unknown'}
**Message:** ${result.message || 'System operational'}

The Aleph API is ${result.status === 'healthy' || result.status === 'ok' ? 'operational and ready' : 'experiencing issues'}.`;

    } catch (error) {
      return `❌ Health check failed: ${error.message}`;
    }
  }

  /**
   * Current Stats Tool
   */
  async currentStats(params) {
    try {
      const { days = 1 } = params;
      const result = await this.client.getCurrentStats(days);

      let response = `📊 The Aleph API Statistics (Last ${days} day${days > 1 ? 's' : ''})\n\n`;

      if (typeof result === 'object') {
        for (const [key, value] of Object.entries(result)) {
          response += `**${key}:** ${JSON.stringify(value, null, 2)}\n`;
        }
      } else {
        response += `${JSON.stringify(result, null, 2)}`;
      }

      return response;

    } catch (error) {
      return `❌ Failed to retrieve current statistics: ${error.message}`;
    }
  }

  /**
   * Daily Stats Tool
   */
  async dailyStats(params) {
    try {
      const { date } = params;
      const result = await this.client.getDailyStats(date);

      let response = `📅 API Statistics for ${date}\n\n`;

      if (typeof result === 'object') {
        for (const [key, value] of Object.entries(result)) {
          response += `**${key}:** ${JSON.stringify(value, null, 2)}\n`;
        }
      } else {
        response += `${JSON.stringify(result, null, 2)}`;
      }

      return response;

    } catch (error) {
      return `❌ Failed to retrieve daily statistics: ${error.message}`;
    }
  }

  /**
   * Summary Stats Tool
   */
  async summaryStats(params) {
    try {
      const result = await this.client.getSummaryStats();

      let response = '📈 API Usage Summary\n\n';

      if (typeof result === 'object') {
        for (const [key, value] of Object.entries(result)) {
          response += `**${key}:** ${JSON.stringify(value, null, 2)}\n`;
        }
      } else {
        response += `${JSON.stringify(result, null, 2)}`;
      }

      return response;

    } catch (error) {
      return `❌ Failed to retrieve summary statistics: ${error.message}`;
    }
  }

  /**
   * Export Stats Tool
   */
  async exportStats(params) {
    try {
      const { format = 'json' } = params;
      const result = await this.client.exportMonitoringData(format);

      let response = `💾 Exported Monitoring Data (${format.toUpperCase()})\n\n`;

      if (format === 'json') {
        response += '```json\n';
        response += JSON.stringify(result, null, 2);
        response += '\n```';
      } else {
        response += result;
      }

      return response;

    } catch (error) {
      return `❌ Failed to export monitoring data: ${error.message}`;
    }
  }

  /**
   * ASN Classifications Tool
   */
  async asnClassifications(params) {
    try {
      const { asn } = params;
      const result = await this.client.getASNClassifications(asn);

      let response = `🏷️ Classifications for ASN ${asn}\n\n`;

      if (typeof result === 'object' && Object.keys(result).length > 0) {
        for (const [key, value] of Object.entries(result)) {
          response += `**${key}:** ${JSON.stringify(value, null, 2)}\n`;
        }
      } else {
        response += 'No classification data available for this ASN.';
      }

      return response;

    } catch (error) {
      return `❌ Failed to retrieve ASN classifications: ${error.message}`;
    }
  }

  /**
   * ASN Regex Tool
   */
  async asnRegex(params) {
    try {
      const { asn } = params;
      const result = await this.client.getASNRegex(asn);

      let response = `🔍 Regex Patterns for ASN ${asn}\n\n`;

      if (typeof result === 'object' && Object.keys(result).length > 0) {
        for (const [key, value] of Object.entries(result)) {
          if (Array.isArray(value)) {
            response += `**${key}:**\n`;
            value.forEach((pattern, idx) => {
              response += `  ${idx + 1}. \`${pattern}\`\n`;
            });
          } else {
            response += `**${key}:** \`${value}\`\n`;
          }
        }
      } else {
        response += 'No regex patterns available for this ASN.';
      }

      return response;

    } catch (error) {
      return `❌ Failed to retrieve ASN regex patterns: ${error.message}`;
    }
  }

  /**
   * ASN Hints Tool
   */
  async asnHints(params) {
    try {
      const { asn } = params;
      const result = await this.client.getASNHints(asn);

      let response = `💡 Geographic Hints for ASN ${asn}\n\n`;

      if (typeof result === 'object' && Object.keys(result).length > 0) {
        for (const [key, value] of Object.entries(result)) {
          response += `**${key}:** ${JSON.stringify(value, null, 2)}\n`;
        }
      } else {
        response += 'No hints available for this ASN.';
      }

      return response;

    } catch (error) {
      return `❌ Failed to retrieve ASN hints: ${error.message}`;
    }
  }

  /**
   * ASN Infrastructure Mapping Tool
   */
  async asnInfrastructureMapping(params) {
    try {
      const { asn } = params;
      const result = await this.client.getASNInfrastructureMapping(asn);

      let response = `🗺️ Infrastructure Mapping for ASN ${asn}\n\n`;

      if (Array.isArray(result) && result.length > 0) {
        result.forEach((location, idx) => {
          response += `**Location ${idx + 1}:**\n`;
          for (const [key, value] of Object.entries(location)) {
            response += `  - ${key}: ${value}\n`;
          }
          response += '\n';
        });
      } else {
        response += 'No infrastructure mapping available for this ASN.';
      }

      return response;

    } catch (error) {
      return `❌ Failed to retrieve infrastructure mapping: ${error.message}`;
    }
  }

  /**
   * ASN Hint Mapping Tool
   */
  async asnHintMapping(params) {
    try {
      const { asn } = params;
      const result = await this.client.getASNHintMapping(asn);

      let response = `🌍 Hint-Based Location Mapping for ASN ${asn}\n\n`;

      if (Array.isArray(result) && result.length > 0) {
        result.forEach((location, idx) => {
          response += `**Location ${idx + 1}:**\n`;
          for (const [key, value] of Object.entries(location)) {
            response += `  - ${key}: ${value}\n`;
          }
          response += '\n';
        });
      } else {
        response += 'No hint mapping available for this ASN.';
      }

      return response;

    } catch (error) {
      return `❌ Failed to retrieve hint mapping: ${error.message}`;
    }
  }

  /**
   * Query PTR Tool
   */
  async queryPTR(params) {
    try {
      const { ptr_record, ip, asn } = params;

      if (!ptr_record && !ip && !asn) {
        return '❌ Please provide at least one of: ptr_record, ip, or asn';
      }

      const result = await this.client.queryPTR(ptr_record, ip, asn);

      let response = '🔎 PTR Query Results\n\n';

      if (result.ptr_record) {
        response += `**PTR Record:** ${result.ptr_record}\n`;
      }
      if (result.ip) {
        response += `**IP Address:** ${result.ip}\n`;
      }
      if (result.asn) {
        response += `**ASN:** ${result.asn}\n`;
      }
      if (result.location_info) {
        response += `**Location Info:** ${JSON.stringify(result.location_info, null, 2)}\n`;
      }
      if (result.regular_expression) {
        response += `**Regex Pattern:** \`${result.regular_expression}\`\n`;
      }
      if (result.geo_hint) {
        response += `**Geo Hint:** ${JSON.stringify(result.geo_hint, null, 2)}\n`;
      }

      return response;

    } catch (error) {
      return `❌ PTR query failed: ${error.message}`;
    }
  }

  /**
   * Batch Query PTR Tool
   */
  async batchQueryPTR(params) {
    try {
      const { queries } = params;

      if (!queries || queries.length === 0) {
        return '❌ Please provide at least one query';
      }

      const result = await this.client.batchQueryPTR(queries);

      let response = `📦 Batch PTR Query Results (${queries.length} queries)\n\n`;

      if (Array.isArray(result)) {
        result.forEach((item, idx) => {
          response += `**Query ${idx + 1}:**\n`;
          if (item.ptr_record) response += `  - PTR: ${item.ptr_record}\n`;
          if (item.ip) response += `  - IP: ${item.ip}\n`;
          if (item.asn) response += `  - ASN: ${item.asn}\n`;
          if (item.location_info) {
            response += `  - Location: ${JSON.stringify(item.location_info)}\n`;
          }
          response += '\n';
        });
      } else {
        response += JSON.stringify(result, null, 2);
      }

      return response;

    } catch (error) {
      return `❌ Batch PTR query failed: ${error.message}`;
    }
  }

  /**
   * Traceroute Mapper Tool
   */
  async tracerouteMapper(params) {
    try {
      const { traceroute, mode = 'string' } = params;

      const result = await this.client.mapTraceroute(traceroute, mode);

      let response = `🛤️ Traceroute Mapping Results (${mode} mode)\n\n`;

      if (Array.isArray(result)) {
        result.forEach((hop, idx) => {
          response += `**Hop ${idx + 1}:**\n`;
          if (hop.ip) response += `  - IP: ${hop.ip}\n`;
          if (hop.asn) response += `  - ASN: ${hop.asn}\n`;
          if (hop.ptr) response += `  - PTR: ${hop.ptr}\n`;
          if (hop.location) {
            response += `  - Location: ${JSON.stringify(hop.location)}\n`;
          }
          response += '\n';
        });
      } else {
        response += JSON.stringify(result, null, 2);
      }

      return response;

    } catch (error) {
      return `❌ Traceroute mapping failed: ${error.message}`;
    }
  }
}

module.exports = TheAlephTools;
