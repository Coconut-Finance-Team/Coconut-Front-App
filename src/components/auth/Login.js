import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/logo.png';
import googleLoginBtn from '../../assets/google.png';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', Arial, sans-serif;
`;

const LogoImage = styled.img`
  width: 140px;
  margin-top: 80px;
  margin-bottom: 40px;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const InfoText = styled.p`
  margin-bottom: 30px;
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  justify-content: flex-start;
`;

const InputContainer = styled.div`
  flex: 1;
  margin-right: 0px;
`;

const Input = styled.input`
  width: 80%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  height: 40px;
  box-sizing: border-box;
  margin-bottom: 12px;

  &:focus {
    outline: none;
    border-color: #4174f6;
  }
`;

const LoginButton = styled.button`
  width: 100px;
  height: 92px;
  background-color: #4174f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s ease;
  margin-top: -8px;
  margin-left: -20px;

  &:hover {
    background-color: #3461d9;
  }
`;

const LinkGroup = styled.div`
  display: flex;
  justify-content: center;
  font-size: 14px;
  color: #666;
  width: 100%;
  gap: 20px;
  margin-top: -8px;
`;

const Link = styled.span`
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: #333;
  }
`;

const GoogleLoginImage = styled.img`
  width: 80%;
  height: auto;
  cursor: pointer;
  margin: 0 auto;
  margin-top: -50px;
  margin-bottom: 20px;
  display: block;
  
  &:hover {
    opacity: 0.9;
  }
`;

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://www.wooricoconut.com/api/v1'
  : 'http://localhost:8080/api/v1';

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('jwtToken', token);
        
        // 현재 로그인한 사용자 정보 가져오기 
        const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser({
            username: userData.username
          });
          alert(`${userData.username}님, 오셨군요! 환영합니다! 🌴`);
          navigate('/');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || '아이디 또는 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      alert('로그인 요청 중 오류가 발생했습니다.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const springBootAuthUrl = process.env.NODE_ENV === 'production'
        ? "https://www.wooricoconut.com/oauth2/authorization/google"
        : "http://localhost:8080/oauth2/authorization/google";
      window.location.href = springBootAuthUrl;
    } catch (error) {
      console.error("Google 로그인 중 오류 발생:", error);
    }
  };

  const handleSignupClick = () => {
    navigate('/signin');
  };

  const handleFindIdPasswordClick = () => {
    navigate('/findidpassword');
  };

  return (
    <Container>
      <LogoImage src={logo} alt="코코넛증권 로고" />
      <FormContainer>
        <InfoText>모두를 위한 증권 플랫폼, 코코넛 증권</InfoText>
        <Form onSubmit={handleLogin}>
          <InputGroup>
            <InputContainer>
              <Input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="아이디"
                autoComplete="id"
                required
              />
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호"
                autoComplete="current-password"
                required
              />
            </InputContainer>
            <LoginButton type="submit">로그인</LoginButton>
          </InputGroup>
        </Form>
        <GoogleLoginImage 
          src={googleLoginBtn} 
          alt="구글 로그인" 
          onClick={handleGoogleLogin}
        />
        <LinkGroup>
          <Link onClick={handleSignupClick}>회원가입</Link>
          <Link onClick={handleFindIdPasswordClick}>ID/비밀번호 찾기</Link>
        </LinkGroup>
      </FormContainer>
    </Container>
  );
}

export default Login;