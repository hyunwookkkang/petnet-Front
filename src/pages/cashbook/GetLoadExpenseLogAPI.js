import axios from "axios";

// 펫넷 상점 주문 내역 불러오기 함수 정의
export const fetchPurchaseLogs = async (setPurchaseLogs, userId) => {
  if (!userId) {
    console.error("userId가 제공되지 않았습니다!");
    return;
  }
  try {
    const response = await axios.get(
      `/api/cashbook/expense/loadExpenseLog/${userId}`
    );
    console.log("주문 내역 데이터:", response.data); // 디버깅 로그
    setPurchaseLogs(response.data); // 상태 업데이트
  } catch (error) {
    console.error("주문 내역 불러오기 실패:", error);
  }
};
