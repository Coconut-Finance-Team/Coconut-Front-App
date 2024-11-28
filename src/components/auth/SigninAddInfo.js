import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IdcardOutlined } from '@ant-design/icons';

function SigninAddInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const prevFormData = location.state;

  const [formData, setFormData] = useState({
    gender: '',
    job: '',
    investmentStyle: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

   const handleCompleteSignup = async () => {
     try {
      const registerRequest = {
        id: prevFormData.username,
        username:prevFormData.name,
        email: prevFormData.email,
        password: prevFormData.password,
        confirmPassword: prevFormData.confirmPassword,
        gender: formData.gender,
        job: formData.job,
        investmentStyle: formData.investmentStyle,
        phone: prevFormData.phoneNumber,
        socialSecurityNumber: prevFormData.birthDate + prevFormData.ssn  // 주민번호 결합
      };

     const response = await axios.post('http://localhost:8080/api/v1/users/register', registerRequest);
     
     if (response.status === 200) {
       navigate('/login');
     }
   } catch (error) {
     console.error('회원가입 실패:', error);
     alert(error.response?.data || '회원가입에 실패했습니다.');
   }
 };

  return (
    <div style={styles.signupContainer}>
      <h2 style={styles.title}>회원님만의 멋진 투자를 위해 선택해주세요!</h2>
      <form onSubmit={(e) => e.preventDefault()} style={styles.signupForm}>
        <div style={styles.inputGroup}>
          <select name="gender" value={formData.gender} onChange={handleChange} style={styles.inputField} required>
            <option value="">성별 선택</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <input
            type="text"
            name="job"
            value={formData.job}
            onChange={handleChange}
            placeholder="직장 (선택)"
            style={styles.inputField}
          />
        </div>

        <div style={styles.inputGroup}>
          <select name="investmentStyle" value={formData.investmentStyle} onChange={handleChange} style={styles.inputField} required>
            <option value="">투자 성향 선택</option>
            <option value="conservative">보수적</option>
            <option value="moderate">중간</option>
            <option value="aggressive">공격적</option>
          </select>
        </div>

        <button type="button" onClick={handleCompleteSignup} style={styles.verificationButton}>회원가입 완료</button>
      </form>
    </div>
  );
}

const styles = {
  signupContainer: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '50px 40px',
    backgroundColor: '#f8f9fa',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '30px',
  },
  signupForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '25px',
    position: 'relative',
  },
  inputField: {
    width: '100%',
    padding: '16px 20px',
    fontSize: '16px',
    border: '1px solid #ced4da',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border 0.3s, box-shadow 0.3s',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  verificationButton: {
    width: '100%',
    padding: '16px',
    marginTop: '20px',
    fontSize: '18px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
};

export default SigninAddInfo;
