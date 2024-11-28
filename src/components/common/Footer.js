import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.linkContainer}>
        <button style={styles.link}>개인정보 처리방침</button> |
        <button style={styles.link}>고객센터 1599-7987</button> |
        <button style={styles.link}>공시사항</button> |
        <button style={styles.link}>자주 묻는 질문</button> |
        <button style={styles.link}>투자 유의사항</button> |
        <button style={styles.link}>이용자권리 및 유의사항</button> |
        <button style={styles.link}>신용정보 활용체계</button> |
        <button style={styles.link}>코코넛증권(주)</button>
      </div>
      <p style={styles.infoText}>
        사업자 등록번호: 319-56-04321  |  대표: 박지원  |  주소: 서울특별시 마포구 월드컵북로 434 상암 IT Tower
      </p>
      <p style={styles.infoText}>
        코코넛증권에서 제공하는 투자 정보는 고객의 투자 판단을 위한 단순 참고용일 뿐, 투자 제안 및 권유, 종목 추천을 위해 작성된 것이 아닙니다.
      </p>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#f8f9fa',
    padding: '20px 0',
    textAlign: 'center',
    fontFamily: '"Noto Sans KR", Arial, sans-serif',
    color: '#adb5bd',
  },
  linkContainer: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  link: {
    color: '#adb5bd',
    textDecoration: 'none',
    padding: '0 5px',
    fontSize: '14px', // 글자 크기를 14px로 확대
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  infoText: {
    color: '#adb5bd',
    fontSize: '13px', // 정보 텍스트의 글자 크기를 13px로 확대
    lineHeight: '1.6',
    margin: '5px 0',
  },
};

export default Footer;
