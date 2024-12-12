import { toast } from "react-toastify";

// 성공 메시지
export const showSuccessToast = (message, options = {}) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...options,
    });
};

// 에러 메시지
export const showErrorToast = (message, options = {}) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...options,
    });
};

/*
1. ...options, ==> 이게 있는 이유

    각자 사용할 때, 옵션값을 직접 적용할 수 있어용
    예를 들어서 { position: "bottom-left" } 이런식으로!!!
    showSuccessToast("로그인되었습니다!",{ position: "bottom-left" });

2. 사용법

    import { showSuccessToast, showErrorToast } from "../../components/common/alert/CommonToast";

    showSuccessToast("저장되었습니다!");
    showErrorToast("저장 실패!");

    끝!!

*/
