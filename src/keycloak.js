import Keycloak from 'keycloak-js';
import appConfig from './config/appConfig';

const keycloakConfig = {
  url: appConfig.keycloak.url,
  realm: appConfig.keycloak.realm,
  clientId: appConfig.keycloak.clientId,
};

const keycloak = new Keycloak(keycloakConfig);

keycloak.onTokenExpired = () => {
  keycloak.updateToken(30).catch(() => {
    console.warn('Keycloak token refresh failed, logging out');
    keycloak.logout();
  });
};

export const initKeycloak = async () => {
  const authenticated = await keycloak.init({
    // onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
  });
  return authenticated;
};

export default keycloak;
