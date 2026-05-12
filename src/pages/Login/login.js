import { useEffect, useState } from 'react';
import appConfig from '../../config/appConfig';

function LoginRedirect() {
  const { url, realm, clientId, redirectUri } = appConfig.keycloak;
  const loginUrl = `${url}/realms/${realm}/protocol/openid-connect/auth?client_id=${clientId}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(redirectUri)}`;

  useEffect(() => {
    window.location.replace(loginUrl);
  }, [loginUrl]);

  const handleManualLogin = () => {
    window.location.replace(loginUrl);
  };

  return (
    <div>
      Đang chuyển đến trang đăng nhập Keycloak...
    </div>
  );
}

export default LoginRedirect;
