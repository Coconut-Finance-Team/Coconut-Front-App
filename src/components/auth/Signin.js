import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signin() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    ssn: '',
    phoneNumber: '',
    telecomProvider: '',
    agreeTerms: false,
    agreeService: false,
    agreePrivacy: false,
    agreeThirdParty: false,
    agreeFinancial: false,
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSSNChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ''); // 숫자 이외의 문자 제거
    setFormData({ ...formData, ssn: value });
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ''); // 숫자 이외의 문자 제거

    if (value.length <= 3) {
      setFormData({ ...formData, phoneNumber: value });
    } else if (value.length <= 7) {
      setFormData({ ...formData, phoneNumber: value.slice(0, 3) + '-' + value.slice(3) });
    } else {
      setFormData({
        ...formData,
        phoneNumber: value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11),
      });
    }
  };

  const handleAgreeAllChange = (e) => {
    const checked = e.target.checked;
    setFormData({
      ...formData,
      agreeTerms: checked,
      agreeService: checked,
      agreePrivacy: checked,
      agreeThirdParty: checked,
      agreeFinancial: checked,
    });
  };

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const birthDateRegex = /^\d{6}$/;
    const ssnRegex = /^\d{7}$/;
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;

    if (!emailRegex.test(formData.email)) {
      setErrorMessage('올바른 이메일 주소를 입력해 주세요.');
      return false;
    }
    if (!birthDateRegex.test(formData.birthDate)) {
      setErrorMessage('올바른 생년월일을 입력해 주세요. (예: 991225)');
      return false;
    }
    if (!ssnRegex.test(formData.ssn)) {
      setErrorMessage('올바른 주민등록번호 뒷자리를 입력해 주세요. (예: 1234567)');
      return false;
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      setErrorMessage('올바른 휴대폰 번호를 입력해 주세요. (예: 010-1234-5678)');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const sendVerificationCode = async () => {
    if (!validateInputs()) return;

    try {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(generatedCode);
      setCountdown(180); // 3분 타이머 시작

      await axios.post('https://465e85cf-bf5d-4280-bdf1-978a53789d32.mock.pstmn.io/send-email', {
        email: formData.email,
        code: generatedCode,
      });

      console.log('인증번호 전송 완료:', generatedCode);
      setErrorMessage('');
    } catch (error) {
      console.error('인증번호 전송 오류:', error);
      setErrorMessage('인증번호 전송에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const verifyCode = () => {
    if (verificationCode !== sentCode) {
      setErrorMessage('인증번호가 일치하지 않습니다. 다시 확인해 주세요.');
      return;
    }
    if (!formData.agreeTerms || !formData.agreeService || !formData.agreePrivacy || !formData.agreeThirdParty) {
      setErrorMessage('인증 및 약관동의를 모두 완료해주세요.');
      return;
    }
    navigate('/signup/userinfo', { state: { ...formData } });
  };

  const isVerificationButtonEnabled = formData.email.length > 0;
  const isVerifyCodeButtonEnabled =
    verificationCode.length > 0 &&
    formData.agreeTerms &&
    formData.agreeService &&
    formData.agreePrivacy &&
    formData.agreeThirdParty;

  return (
    <div style={styles.signupContainer}>
      <h2 style={styles.title}>회원가입</h2>

      <form style={styles.signupForm}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름"
            style={styles.inputField}
            required
          />
        </div>

        <div style={styles.inputGroupRow}>
          <input
            type="text"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            placeholder="생년월일 (예: 991225)"
            style={styles.inputFieldHalf}
            required
            maxLength="6"
          />
          <span style={styles.separator}>-</span>
          <input
            type="password"
            name="ssn"
            value={formData.ssn}
            onChange={handleSSNChange}
            placeholder="주민번호 뒷자리"
            style={styles.inputFieldHalf}
            required
            maxLength="7"
          />
        </div>

        <div style={styles.inputGroupRow}>
          <select
            name="telecomProvider"
            value={formData.telecomProvider}
            onChange={handleChange}
            style={{ ...styles.inputFieldHalf, width: '30%' }}
          >
            <option value="">통신사 선택 (선택 사항)</option>
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LG U+">LG U+</option>
          </select>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            placeholder="휴대폰 번호 (예: 010-1234-5678)"
            style={{ ...styles.inputFieldHalf, width: '70%' }}
            required
            maxLength="13"
          />
        </div>

        <div style={styles.inputGroup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일 주소 (예: example@example.com)"
            style={styles.inputField}
            required
          />
          <button
            type="button"
            onClick={sendVerificationCode}
            style={{
              ...styles.verificationButton,
              backgroundColor: isVerificationButtonEnabled ? '#1f8ef1' : '#c0c0c0',
              cursor: isVerificationButtonEnabled ? 'pointer' : 'not-allowed',
            }}
            disabled={!isVerificationButtonEnabled}
          >
            인증번호 받기
          </button>
        </div>

        <div style={styles.inputGroup}>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder={`인증번호 입력 (${Math.floor(countdown / 60)}:${('0' + (countdown % 60)).slice(-2)})`}
            style={styles.inputField}
            required
          />
        </div>

        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleAgreeAllChange}
              required
            />
            필수 약관에 모두 동의
          </label>
        </div>
        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="agreeService"
              checked={formData.agreeService}
              onChange={handleChange}
              required
            />
            휴대폰 본인확인 서비스 약관 동의
          </label>
        </div>
        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="agreePrivacy"
              checked={formData.agreePrivacy}
              onChange={handleChange}
              required
            />
            개인정보 제3자 제공 동의
          </label>
        </div>
        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="agreeThirdParty"
              checked={formData.agreeThirdParty}
              onChange={handleChange}
              required
            />
            개인(신용)정보 수집 이용 동의
          </label>
        </div>
      </form>

      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      <button
        type="button"
        onClick={verifyCode}
        style={{
          ...styles.verificationButton,
          backgroundColor: isVerifyCodeButtonEnabled ? '#1f8ef1' : '#c0c0c0',
          cursor: isVerifyCodeButtonEnabled ? 'pointer' : 'not-allowed',
        }}
        disabled={!isVerifyCodeButtonEnabled}
      >
        인증하기
      </button>
    </div>
  );
}

const styles = {
  signupContainer: {
    maxWidth: '450px',
    margin: '50px auto',
    padding: '40px 30px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  title: {
    fontSize: '26px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '25px',
  },
  signupForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
    position: 'relative',
  },
  inputGroupRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '10px',
  },
  inputField: {
    width: '100%',
    padding: '18px 12px',
    fontSize: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border 0.3s, box-shadow 0.3s',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  inputFieldHalf: {
    width: 'calc(50% - 10px)',
    padding: '18px 12px',
    fontSize: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border 0.3s, box-shadow 0.3s',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  separator: {
    fontSize: '20px',
    margin: '0 10px',
  },
  verificationButton: {
    width: '100%',
    padding: '14px',
    marginTop: '10px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#1f8ef1',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: '15px',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#555',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  errorMessage: {
    color: '#d32f2f',
    fontSize: '14px',
    marginTop: '20px',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
};

export default Signin;
