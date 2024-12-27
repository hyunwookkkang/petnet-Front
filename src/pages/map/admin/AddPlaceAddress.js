import React, { useState } from "react";
import axios from "axios";
import { showErrorToast } from "../../../components/common/alert/CommonToast";

const AddPlaceAddress = ({ onAddressSelected }) => {
    const [address, setAddress] = useState("");

    const handleSearch = async () => {
        if (!address.trim()) {
            showErrorToast("주소를 입력해주세요.");
            return;
        }

        try {
            console.log("프록시를 거친 요청 URL:", `/api/google/geocode?address=${address}`);

            // 요청을 보낼 때 인코딩 제거
            const response = await axios.get(`/api/google/geocode`, {
                params: { address } // 인코딩 제거
            });

            console.log("API 응답:", response);

            if (response.data) {
                const { lat, lng } = response.data;
                console.log("위도:", lat, "경도:", lng);

                onAddressSelected({
                    address,
                    latitude: lat,
                    longitude: lng
                });
            } else {
                showErrorToast("응답 데이터가 비어 있습니다.");
            }
        } catch (error) {
            console.error("주소 검색 오류:", error.response?.data || error.message);
            showErrorToast("주소에 해당하는 좌표를 찾을 수 없습니다.");
        }
    };

    return (
        <div>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="주소를 입력하세요"
            />
            <button onClick={handleSearch}>주소 검색</button>
        </div>
    );
};

export default AddPlaceAddress;
