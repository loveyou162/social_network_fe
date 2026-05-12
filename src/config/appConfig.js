const appConfig = {
  apiUrl: 'http://localhost:5000/api',
  keycloak: {
    url: 'http://localhost:8081',
    realm: 'master',
    clientId: 'instagram',
    redirectUri: 'http://localhost:5000/api/auth/keycloak/callback',
  },
};

export default appConfig;
