#!/usr/bin/env node
/**
 * Unit tests for The Aleph MCP Tools
 */

const TheAlephTools = require('../../src/tools');

class ToolsTests {
  constructor() {
    this.passed = 0;
    this.failed = 0;
  }

  async runTests() {
    console.log('🧪 Running The Aleph MCP Tools Unit Tests\n');

    await this.testToolDefinitions();
    await this.testToolSchemas();
    await this.testToolExecution();
    await this.testParameterValidation();

    console.log(`\n📊 Unit Test Results:`);
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    
    return this.failed === 0;
  }

  async testToolDefinitions() {
    console.log('📋 Testing tool definitions...');
    
    try {
      const tools = new TheAlephTools();
      const definitions = tools.getToolDefinitions();
      
      this.assert(Array.isArray(definitions), 'Tool definitions should be an array');
      this.assert(definitions.length === 13, 'Should have exactly 13 tool definitions');

      // Check required fields
      for (const tool of definitions) {
        this.assert(typeof tool.name === 'string', 'Tool name should be string');
        this.assert(typeof tool.description === 'string', 'Tool description should be string');
        this.assert(typeof tool.inputSchema === 'object', 'Tool inputSchema should be object');
        this.assert(tool.inputSchema.type === 'object', 'InputSchema type should be object');
      }

      // Check specific tools exist
      const toolNames = definitions.map(t => t.name);
      const expectedTools = [
        'thealeph_health_check',
        'thealeph_current_stats',
        'thealeph_daily_stats',
        'thealeph_summary_stats',
        'thealeph_export_stats',
        'thealeph_asn_classifications',
        'thealeph_asn_regex',
        'thealeph_asn_hints',
        'thealeph_asn_infrastructure_mapping',
        'thealeph_asn_hint_mapping',
        'thealeph_query_ptr',
        'thealeph_batch_query_ptr',
        'thealeph_traceroute_mapper'
      ];

      for (const expectedTool of expectedTools) {
        this.assert(toolNames.includes(expectedTool), `Should include tool: ${expectedTool}`);
      }
      
      console.log('✅ Tool definitions tests passed');
    } catch (error) {
      console.log(`❌ Tool definitions tests failed: ${error.message}`);
      this.failed++;
    }
  }

  async testToolSchemas() {
    console.log('📋 Testing tool schemas...');

    try {
      const tools = new TheAlephTools();
      const definitions = tools.getToolDefinitions();

      // Test ASN classifications tool schema
      const asnClassTool = definitions.find(t => t.name === 'thealeph_asn_classifications');
      this.assert(asnClassTool !== undefined, 'ASN classifications tool should exist');

      const schema = asnClassTool.inputSchema;
      this.assert(schema.properties.asn.type === 'string', 'ASN should be string type');
      this.assert(schema.required.includes('asn'), 'ASN should be required');

      // Test PTR query tool schema
      const ptrTool = definitions.find(t => t.name === 'thealeph_query_ptr');
      this.assert(ptrTool !== undefined, 'PTR query tool should exist');

      const ptrSchema = ptrTool.inputSchema;
      this.assert(ptrSchema.properties.ptr_record !== undefined, 'Should have ptr_record param');
      this.assert(ptrSchema.properties.ip !== undefined, 'Should have ip param');
      this.assert(ptrSchema.properties.asn !== undefined, 'Should have asn param');

      // Test batch query tool schema
      const batchTool = definitions.find(t => t.name === 'thealeph_batch_query_ptr');
      this.assert(batchTool !== undefined, 'Batch query tool should exist');

      const batchSchema = batchTool.inputSchema;
      this.assert(batchSchema.properties.queries.type === 'array', 'Queries should be array type');
      this.assert(batchSchema.properties.queries.maxItems === 100, 'Should limit to 100 queries');

      console.log('✅ Tool schemas tests passed');
    } catch (error) {
      console.log(`❌ Tool schemas tests failed: ${error.message}`);
      this.failed++;
    }
  }

  async testToolExecution() {
    console.log('📋 Testing tool execution routing...');
    
    try {
      const tools = new TheAlephTools('http://nonexistent.invalid');
      
      // Test unknown tool
      try {
        await tools.executeTool('nonexistent_tool');
        this.assert(false, 'Unknown tool should throw error');
      } catch (error) {
        this.assert(error.message.includes('Unknown tool'), 'Should throw unknown tool error');
      }
      
      // Test valid tool names (will fail due to invalid URL, but routing should work)
      const validTools = [
        'thealeph_health_check',
        'thealeph_current_stats',
        'thealeph_summary_stats',
        'thealeph_asn_classifications'
      ];

      for (const toolName of validTools) {
        try {
          await tools.executeTool(toolName);
          // If it doesn't throw "Unknown tool" error, routing works
        } catch (error) {
          this.assert(!error.message.includes('Unknown tool'),
            `Tool ${toolName} should be routed correctly`);
        }
      }
      
      console.log('✅ Tool execution tests passed');
    } catch (error) {
      console.log(`❌ Tool execution tests failed: ${error.message}`);
      this.failed++;
    }
  }

  async testParameterValidation() {
    console.log('📋 Testing parameter handling...');
    
    try {
      const tools = new TheAlephTools('http://nonexistent.invalid');
      
      // Test that tools accept parameters without throwing validation errors
      const testCases = [
        { tool: 'thealeph_asn_classifications', params: { asn: '15169' } },
        { tool: 'thealeph_current_stats', params: { days: 7 } },
        { tool: 'thealeph_daily_stats', params: { date: '2024-10-27' } },
        { tool: 'thealeph_query_ptr', params: { ip: '8.8.8.8' } },
        { tool: 'thealeph_batch_query_ptr', params: { queries: [{ ip: '8.8.8.8' }] } }
      ];

      for (const testCase of testCases) {
        try {
          await tools.executeTool(testCase.tool, testCase.params);
          // Will fail due to network, but should not fail on parameter validation
        } catch (error) {
          this.assert(!error.message.includes('validation'),
            `Parameters for ${testCase.tool} should be valid`);
          this.assert(!error.message.includes('Unknown tool'),
            `Tool ${testCase.tool} should exist`);
        }
      }
      
      console.log('✅ Parameter validation tests passed');
    } catch (error) {
      console.log(`❌ Parameter validation tests failed: ${error.message}`);
      this.failed++;
    }
  }

  assert(condition, message) {
    if (condition) {
      this.passed++;
    } else {
      this.failed++;
      throw new Error(message);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tests = new ToolsTests();
  tests.runTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}

module.exports = ToolsTests;