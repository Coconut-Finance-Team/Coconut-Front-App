import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SigninUserInfo() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
  });
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state;

  useEffect(() => {
    const allCriteriaMet = passwordCriteria.length && passwordCriteria.uppercase && passwordCriteria.specialChar;
    const passwordsMatch = formData.password === formData.confirmPassword;
    setIsButtonEnabled(allCriteriaMet && passwordsMatch && !usernameError && !passwordError);
  }, [formData, passwordCriteria, usernameError, passwordError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const lengthCriteria = password.length >= 8;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const specialCharCriteria = /[!@#$%^&*]/.test(password);

    setPasswordCriteria({
      length: lengthCriteria,
      uppercase: uppercaseCriteria,
      specialChar: specialCharCriteria,
    });

    if (!lengthCriteria || !uppercaseCriteria || !specialCharCriteria) {
      setPasswordError('비밀번호는 8자 이상, 대문자, 특수문자를 포함해야 합니다.');
    } else {
      setPasswordError('');
    }
  };

  const checkUsername = async () => {
    // Skipping username check for now
    setUsernameError('');
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!usernameError && !passwordError && formData.password === formData.confirmPassword) {
      navigate('/signup/signinaddinfo', { state: { ...previousData, ...formData } });
    } else if (formData.password !== formData.confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div style={styles.signupContainer}>
      <h2 style={styles.title}>코코넛 증권 사용을 위해 <br />아이디, 비밀번호를 설정해주세요!</h2>
      <form onSubmit={handleNext} style={styles.signupForm}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={checkUsername}
            placeholder="아이디"
            style={styles.inputField}
            required
          />
          {usernameError && <p style={styles.errorMessage}>{usernameError}</p>}
        </div>

        <div style={styles.inputGroup}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            style={styles.inputField}
            required
          />
          <div style={styles.passwordCriteriaContainer}>
            <div style={{ ...styles.passwordCriteriaItem, color: passwordCriteria.length ? '#4caf50' : '#e53935' }}>
              {passwordCriteria.length && <span style={styles.checkIcon}>✔</span>} 8자 이상
            </div>
            <div style={{ ...styles.passwordCriteriaItem, color: passwordCriteria.uppercase ? '#4caf50' : '#e53935' }}>
              {passwordCriteria.uppercase && <span style={styles.checkIcon}>✔</span>} 대문자 포함
            </div>
            <div style={{ ...styles.passwordCriteriaItem, color: passwordCriteria.specialChar ? '#4caf50' : '#e53935' }}>
              {passwordCriteria.specialChar && <span style={styles.checkIcon}>✔</span>} 특수문자 포함
            </div>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 확인"
            style={styles.inputField}
            required
          />
          {passwordError && <p style={styles.errorMessage}>{passwordError}</p>}
        </div>

        <button type="submit" style={{ ...styles.verificationButton, backgroundColor: isButtonEnabled ? '#007bff' : '#ced4da', cursor: isButtonEnabled ? 'pointer' : 'not-allowed' }} disabled={!isButtonEnabled}>다음 단계로</button>
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
  errorMessage: {
    color: '#e53935',
    fontSize: '14px',
    marginTop: '10px',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  passwordCriteriaContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f1f3f5',
    borderRadius: '8px',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  passwordCriteriaItem: {
    display: 'flex',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: '5px',
    color: '#4caf50',
    fontWeight: 'bold',
  },
};

export default SigninUserInfo;
