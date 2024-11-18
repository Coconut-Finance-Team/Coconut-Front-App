// RightsModal.js
import React from 'react';
import styled from 'styled-components';
import ModalOverlay from './ModalOverlay'; // ModalOverlay 재사용

const ModalContent = styled.div`
  width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  font-family: 'Noto Sans KR', sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
`;

const ToggleContent = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 16px;
`;

const RightsModal = ({ onClose }) => (
  <ModalOverlay>
    <ModalContent>
      <ModalHeader>
        <ModalTitle>권리내역</ModalTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </ModalHeader>
      <ToggleContent>
        발생한 권리, BW, 전환우선주, 해외주식 등의 처리 방법은 코코넛증권 고객센터(1500-5284)에 문의해 주세요.<br /><br />
        <strong>배당</strong><br />
        회사는 배당가능 이익으로 주주에 배당할 수 있습니다. 배당금은 배당락 전까지 해당 주식을 보유하고 계신 고객님께 제공됩니다.<br />
        배당금은 현지 지급일의 보통 익영업일, 고객님의 계좌에 외화(HKD, USD, JPY)로 입금되며, 입금 전 배당세가 차감되어 지급됩니다.<br />
        홍콩/중국은 발행회사의 결정에 따라 주주가 미리 배당 종류(현금/주식)를 선택할 수 있는 경우도 있습니다.<br />
        배당과 관련된 세율은 국가별로 차이가 있으니 수수료 세금 안내 페이지를 참고하여 주시기 바랍니다.<br />
        국가별 배당세 바로가기<br /><br />
        <em>유상증자</em><br />
        유상증자는 기업이 투자가로부터 새로운 자금 조달을 받아 신주를 발행하는 것을 뜻합니다. 일반적으로 신주 청약, 주금 납입 등의 절차가 필요합니다.<br />
        해외 업무 상의 시차로 유상 청약기간 등에 대한 통보가 지연될 수 있습니다.<br /><br />
        <em>무상증자</em><br />
        무상증자는 기업 자본의 법률상 증가 만을 가져오는 명목상의 증자입니다. 권리락 전까지 해당 주식을 보유하고 계신 고객님께 신주가 무상으로 배정됩니다.<br />
        홍콩/중국은 발행회사의 결정에 따라 무상 워런트가 배정될 수 있으며, 권리로 지급되는 무상 워런트의 경우 만기가 경과하면 자동적으로 그 권리가 소멸됩니다.<br />
        일본의 경우 액면가격이 존재하지 않으므로 무상증자는 주식분할 형태로 발생합니다.<br /><br />
        <strong>회사합병</strong><br />
        합병은 둘 이상의 회사가 하나의 회사로 되는 것을 말합니다. 합병 전 회사가 전부 해산하고 새로운 기업이 설립되는 경우 (신설합병)와, 어떤 한쪽이 존속하고 상대방을 흡수하는 경우(흡수합병)가 있습니다.<br />
        합병 결정에 반대하는 주주에 주식 매수청구권이 주어질 수 있으며, 합병 후 합병 비율에 따라 주식배정 등이 발생합니다.<br /><br />
        <strong>주식병합/분할</strong><br />
        <em>주식병합</em><br />
        주식병합은 두 개 이상의 주식을 1주로 통합하여 발행주식수를 감소시키는 것입니다. 예를 들면 2주→1주의 주식합병을 실시하는 경우 발행주식수는 1/2로 감소하나, 논리적인 1주당 가격은 2배가 됩니다.<br /><br />
        <em>주식분할</em><br />
        주식분할은 1주를 분할하여 발행주식수를 증가시키는 것입니다. 예를 들면 1주→2주로 분할하면 주주들의 보유주식 수는 2배가 되지만 1주당 가격은 1/2가 됩니다.<br />
      </ToggleContent>
    </ModalContent>
  </ModalOverlay>
);

export default RightsModal;
