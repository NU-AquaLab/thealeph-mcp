#!/usr/bin/env node
/**
 * Integration tests for The Aleph API connectivity
 */

const TheAlephAPIClient = require('../../src/client');
const TheAlephTools = require('../../src/tools');

class APIIntegrationTests {
  constructor(apiUrl) {
    this.apiUrl = apiUrl || process.env.THEALEPH_API_URL || 'https://thealeph.ai';
    this.client = new TheAlephAPIClient(this.apiUrl);
    this.tools = new TheAlephTools(this.apiUrl);
    this.passed = 0;
    this.failed = 0;
  }

  async runTests() {
    console.log('🧪 Running The Aleph API Integration Tests\n');
    console.log(`🌐 Testing against: ${this.apiUrl}\n`);

    await this.testAPIConnectivity();
    await this.testHealthEndpoint();
    await this.testCurrentStatsEndpoint();
    await this.testASNClassificationsEndpoint();
    await this.testPTRQueryEndpoint();

    console.log(`\n📊 Integration Test Results:`);
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);

    return this.failed === 0;
  }

  async testAPIConnectivity() {
    console.log('📋 Testing basic API connectivity...');

    try {
      const result = await this.client.testConnection();

      if (result.success) {
        this.assert(true, 'API connection successful');
        this.assert(typeof result.status === 'string', 'Status should be string');
        this.assert(typeof result.message === 'string', 'Message should be string');
        console.log(`   Status: ${result.status}`);
        console.log(`   Message: ${result.message}`);
        console.log('✅ API connectivity tests passed');
      } else {
        console.log(`⚠️  API connectivity failed: ${result.error}`);
        console.log('   Continuing with tests (may fail)...');
        this.failed++;
      }
    } catch (error) {
      console.log(`❌ API connectivity tests failed: ${error.message}`);
      this.failed++;
    }
  }

  async testHealthEndpoint() {
    console.log('📋 Testing health endpoint...');
    
    try {
      const result = await this.client.healthCheck();
      
      this.assert(typeof result === 'object', 'Health result should be object');
      this.assert(typeof result.status === 'string', 'Status should be string');
      
      if (result.database) {
        this.assert(typeof result.database.status === 'string', 'Database status should be string');
      }
      
      console.log('✅ Health endpoint tests passed');
    } catch (error) {
      console.log(`❌ Health endpoint tests failed: ${error.message}`);
      this.failed++;
    }
  }

  async testCurrentStatsEndpoint() {
    console.log('📋 Testing current stats endpoint...');

    try {
      const result = await this.client.getCurrentStats(1);

      this.assert(typeof result === 'object', 'Current stats should be object');

      console.log('✅ Current stats endpoint tests passed');
    } catch (error) {
      console.log(`❌ Current stats endpoint tests failed: ${error.message}`);
      this.failed++;
    }
  }

  async testASNClassificationsEndpoint() {
    console.log('📋 Testing ASN classifications endpoint...');

    try {
      // Test with Google's ASN
      const result = await this.client.getASNClassifications('15169');

      this.assert(typeof result === 'object', 'ASN classifications result should be object');

      console.log('✅ ASN classifications endpoint tests passed');
    } catch (error) {
      console.log(`❌ ASN classifications endpoint tests failed: ${error.message}`);
      this.failed++;
    }
  }

  async testPTRQueryEndpoint() {
    console.log('📋 Testing PTR query endpoint...');

    try {
      // Test with Google's DNS IP
      const result = await this.client.queryPTR(null, '8.8.8.8', null);

      this.assert(typeof result === 'object', 'PTR query result should be object');

      if (result.ip) {
        this.assert(typeof result.ip === 'string', 'IP should be string');
      }

      console.log('✅ PTR query endpoint tests passed');
    } catch (error) {
      console.log(`❌ PTR query endpoint tests failed: ${error.message}`);
      this.failed++;
    }
  }

  async testToolIntegration() {
    console.log('📋 Testing tool integration...');

    try {
      // Test health check tool
      const healthResult = await this.tools.executeTool('thealeph_health_check');
      this.assert(typeof healthResult === 'string', 'Tool result should be string');
      this.assert(healthResult.includes('Health Check'), 'Should contain health check info');

      // Test summary stats tool
      const summaryResult = await this.tools.executeTool('thealeph_summary_stats');
      this.assert(typeof summaryResult === 'string', 'Tool result should be string');
      this.assert(summaryResult.includes('Summary'), 'Should contain summary info');

      console.log('✅ Tool integration tests passed');
    } catch (error) {
      console.log(`❌ Tool integration tests failed: ${error.message}`);
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
  const apiUrl = process.argv[2] || process.env.THEALEPH_API_URL;
  const tests = new APIIntegrationTests(apiUrl);
  
  tests.runTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}

module.exports = APIIntegrationTests;