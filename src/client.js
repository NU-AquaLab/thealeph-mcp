/**
 * The Aleph API Client for Node.js
 * Communicates with The Aleph HTTP API endpoints
 */

const axios = require('axios');

class TheAlephAPIClient {
  constructor(baseUrl = 'https://thealeph.ai', options = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = options.timeout || 30000;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;

    // Create axios instance with default config
    this.axios = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'thealeph-mcp/1.0.0'
      }
    });

    // Add response interceptor for error handling
    this.axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          // Server responded with error status
          const errorMessage = error.response.data?.message || error.response.data?.error || error.message;
          throw new Error(`The Aleph API Error (${error.response.status}): ${errorMessage}`);
        } else if (error.request) {
          // Request made but no response received
          throw new Error(`The Aleph API Connection Error: ${error.message}`);
        } else {
          // Something else happened
          throw new Error(`The Aleph API Error: ${error.message}`);
        }
      }
    );
  }

  /**
   * Make HTTP request with retry logic
   */
  async makeRequest(method, endpoint, options = {}) {
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.axios.request({
          method,
          url: endpoint,
          ...options
        });
        return response.data;
      } catch (error) {
        if (attempt === this.retryAttempts) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve =>
          setTimeout(resolve, this.retryDelay * Math.pow(2, attempt - 1))
        );
      }
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck() {
    return this.makeRequest('GET', '/monitoring/health');
  }

  /**
   * Get current statistics
   */
  async getCurrentStats(days = 1) {
    return this.makeRequest('GET', '/monitoring/stats/current', {
      params: { days }
    });
  }

  /**
   * Get daily statistics for a specific date
   */
  async getDailyStats(date) {
    return this.makeRequest('GET', `/monitoring/stats/daily/${date}`);
  }

  /**
   * Get summary statistics
   */
  async getSummaryStats() {
    return this.makeRequest('GET', '/monitoring/stats/summary');
  }

  /**
   * Export monitoring data
   */
  async exportMonitoringData(format = 'json') {
    return this.makeRequest('GET', '/monitoring/stats/export', {
      params: { format }
    });
  }

  /**
   * Get classifications by ASN
   */
  async getASNClassifications(asn) {
    return this.makeRequest('GET', `/api/asn/${asn}/classifications`);
  }

  /**
   * Get regex patterns by ASN
   */
  async getASNRegex(asn) {
    return this.makeRequest('GET', `/api/asn/${asn}/regex`);
  }

  /**
   * Get hints by ASN
   */
  async getASNHints(asn) {
    return this.makeRequest('GET', `/api/asn/${asn}/hints`);
  }

  /**
   * Get infrastructure mapping by ASN
   */
  async getASNInfrastructureMapping(asn) {
    return this.makeRequest('GET', `/api/asn/${asn}/infrastructure_mapping`);
  }

  /**
   * Get hint mapping by ASN
   */
  async getASNHintMapping(asn) {
    return this.makeRequest('GET', `/api/asn/${asn}/hint_mapping`);
  }

  /**
   * Query PTR record
   */
  async queryPTR(ptrRecord = null, ip = null, asn = null) {
    const data = {};
    if (ptrRecord) data.ptr_record = ptrRecord;
    if (ip) data.ip = ip;
    if (asn) data.asn = asn;

    return this.makeRequest('POST', '/api/query', { data });
  }

  /**
   * Batch query PTR records
   */
  async batchQueryPTR(queries) {
    return this.makeRequest('POST', '/api/batch_query', {
      data: { queries }
    });
  }

  /**
   * Map traceroute
   */
  async mapTraceroute(traceroute, mode = 'string') {
    return this.makeRequest('POST', '/api/traceroute_mapper', {
      data: { traceroute, mode }
    });
  }

  /**
   * Test connection to The Aleph API
   */
  async testConnection() {
    try {
      const health = await this.healthCheck();
      return {
        success: true,
        status: health.status || 'healthy',
        baseUrl: this.baseUrl,
        message: health.message || 'Connected successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        baseUrl: this.baseUrl
      };
    }
  }
}

module.exports = TheAlephAPIClient;
