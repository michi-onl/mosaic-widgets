class APIClient {
  constructor(baseUrl, token = "") {
    this.baseUrl = baseUrl;
    this.token = token;
    this.timeout = 10; // 10 seconds, matching API timeout
  }

  async fetch(endpoint, params = {}) {
    if (this.token) params.token = this.token;
    const url = this.buildUrl(endpoint, params);
    console.log(`Fetching: ${endpoint}`);

    const request = new Request(url);
    request.timeoutInterval = this.timeout;

    try {
      const response = await request.loadJSON();
      console.log(`Success: ${endpoint}`);
      return response;
    } catch (error) {
      console.error(`API Error for ${endpoint}: ${error.message}`);
      console.error(`URL was: ${endpoint}`);
      throw new Error(`Failed to fetch from ${endpoint}: ${error.message}`);
    }
  }

  async post(endpoint, body = {}) {
    const params = this.token ? { token: this.token } : {};
    const url = this.buildUrl(endpoint, params);
    console.log(`POST: ${endpoint}`);

    const request = new Request(url);
    request.method = "POST";
    request.timeoutInterval = this.timeout;
    request.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    request.body = this.encodeParams(body);

    try {
      const response = await request.loadJSON();
      console.log(`Success: ${endpoint}`);
      return response;
    } catch (error) {
      console.error(`API Error for ${endpoint}: ${error.message}`);
      throw new Error(`Failed to POST to ${endpoint}: ${error.message}`);
    }
  }

  encodeParams(params) {
    return Object.entries(params)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");
  }

  buildUrl(endpoint, params) {
    let url = this.baseUrl + endpoint;
    // Filter out empty values to avoid appending ?token= to external APIs
    const filtered = Object.fromEntries(
      Object.entries(params).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined,
      ),
    );
    if (Object.keys(filtered).length === 0) return url;
    const separator = url.includes("?") ? "&" : "?";
    return url + separator + this.encodeParams(filtered);
  }
}

module.exports = { APIClient };
