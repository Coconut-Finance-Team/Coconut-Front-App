import React from 'react';
import { GoogleLogin } from 'react-google-login';

const LoginTest = () => {
  const onSuccess = (response) => {
    console.log('로그인 성공:', response);
  };

  const onFailure = (response) => {
    console.log('로그인 실패:', response);
  };

  return (
    <div>
      <h1>Google 로그인 테스트</h1>
      <GoogleLogin
        clientId="YOUR_GOOGLE_CLIENT_ID" // Google Cloud Console에서 생성한 클라이언트 ID
        buttonText="Google로 로그인"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default LoginTest;
