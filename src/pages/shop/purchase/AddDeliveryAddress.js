import React from "react";

const AddDeliveryAddress = ({ onAddressSelected }) => {
  const execDaumPostcode = () => {
    if (!window.daum || !window.daum.Postcode) {
      console.error("Daum Postcode API is not loaded.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        let fullAddr = "";
        let extraAddr = "";

        if (data.userSelectedType === "R") {
          fullAddr = data.roadAddress;
        } else {
          fullAddr = data.jibunAddress;
        }

        if (data.userSelectedType === "R") {
          if (data.bname !== "") {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddr += extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
          }
          fullAddr += extraAddr !== "" ? ` (${extraAddr})` : "";
        }

        // 상위 컴포넌트로 데이터 전달
        onAddressSelected({
          zipCode: data.zonecode,
          deliveryAddress: fullAddr,
        });
      },
    }).open();
  };

  return (
    <div>
      <button type="button" onClick={execDaumPostcode}>
        우편번호 찾기
      </button>
    </div>
  );
};

export default AddDeliveryAddress;
