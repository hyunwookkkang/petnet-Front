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

        onAddressSelected({
          postcode: data.zonecode,
          address: fullAddr,
        });
      },
    }).open();
  };

  return (
    <div>
      <input type="text" placeholder="우편번호" readOnly />
      <input
        type="button"
        onClick={execDaumPostcode}
        value="우편번호 찾기"
        style={{ marginLeft: "10px" }}
      />
      <input type="text" placeholder="주소" readOnly style={{ marginTop: "10px", width: "100%" }} />
      <input type="text" placeholder="상세주소" style={{ marginTop: "10px", width: "100%" }} />
    </div>
  );
};

export default AddDeliveryAddress;