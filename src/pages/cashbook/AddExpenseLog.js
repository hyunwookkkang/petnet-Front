import React from "react";
import FloatingButtonWithSlide from "../../components/cashbook/FloatingButtonWithSlide"; // 경로 수정
import SlideDrawer from "../../components/cashbook/SlideDrawer";

const AddExpenseLog = () => {
  return <FloatingButtonWithSlide slideContent={<SlideDrawer />} />;
};

export default AddExpenseLog;
