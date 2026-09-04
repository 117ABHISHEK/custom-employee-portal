const axios = require('axios');

let cachedToken = null;
let tokenExpiresAt = 0;

// Fetches a fresh Zoho access token using the refresh token, with in-memory caching
// so we don't hit Zoho's token endpoint on every single request.
async function getZohoAccessToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const response = await axios.post(
      `https://${process.env.ZOHO_ACCOUNTS_DOMAIN}/oauth/v2/token`,
      null,
      {
        params: {
          refresh_token: process.env.ZOHO_REFRESH_TOKEN,
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          grant_type: 'refresh_token'
        }
      }
    );

    cachedToken = response.data.access_token;
    // Zoho tokens expire in ~3600s; refresh 5 min early to be safe
    tokenExpiresAt = now + (response.data.expires_in - 300) * 1000;

    return cachedToken;
  } catch (error) {
    console.error('Failed to retrieve Zoho Access Token:', error.response?.data || error.message);
    throw new Error('Zoho authentication failed');
  }
}

// Generic proxy function: calls any Zoho API endpoint with a valid access token attached
async function callZohoApi(path, method = 'GET', data = null, domain = process.env.ZOHO_API_DOMAIN) {
  const accessToken = await getZohoAccessToken();
  const url = `https://${domain}${path}`;

  try {
    const response = await axios({
      url,
      method,
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`
      },
      data
    });
    return response.data;
  } catch (error) {
    console.error(`Zoho API call failed [${method} ${path}]:`, error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getZohoAccessToken, callZohoApi };