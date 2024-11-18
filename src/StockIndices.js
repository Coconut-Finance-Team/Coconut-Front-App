import React, { useEffect, useState } from "react";

const StockIndices = () => {
  const [kospi, setKospi] = useState(null);
  const [kosdaq, setKosdaq] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const websocketUrl = "ws://your-websocket-server-address"; // WebSocket 서버 주소
    const socket = new WebSocket(websocketUrl);

    // WebSocket 연결 성공
    socket.onopen = () => {
      console.log("[WebSocket] 연결 성공");
    };

    // WebSocket 데이터 수신
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[WebSocket] 수신 데이터:", data);

        if (data.kospi) setKospi(data.kospi);
        if (data.kosdaq) setKosdaq(data.kosdaq);
      } catch (err) {
        console.error("[WebSocket] 데이터 파싱 오류:", err);
        setError("데이터를 처리하는 중 오류가 발생했습니다.");
      }
    };

    // WebSocket 오류 처리
    socket.onerror = (err) => {
      console.error("[WebSocket] 오류 발생:", err);
      setError("WebSocket 연결 중 오류가 발생했습니다.");
    };

    // WebSocket 연결 종료
    socket.onclose = () => {
      console.log("[WebSocket] 연결 종료");
    };

    // 컴포넌트 언마운트 시 WebSocket 닫기
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>실시간 주식 지수</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h2>KOSPI</h2>
        {kospi ? (
          <p>
            지수: {kospi.index}, 변화량: {kospi.change}
          </p>
        ) : (
          <p>데이터를 불러오는 중...</p>
        )}
      </div>
      <div>
        <h2>KOSDAQ</h2>
        {kosdaq ? (
          <p>
            지수: {kosdaq.index}, 변화량: {kosdaq.change}
          </p>
        ) : (
          <p>데이터를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
};

export default StockIndices;
