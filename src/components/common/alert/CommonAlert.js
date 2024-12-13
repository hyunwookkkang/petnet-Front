import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";

const StyledAlert = styled(Alert)(({ theme }) => ({
    position: "fixed",
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1300,
    backgroundColor: "#febe98", 
    color: "#000", // 텍스트 색상 (가독성 향상)
    }));

    function CommonAlert({ open, message, duration = 3000, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (open) {
        setIsVisible(true); // Alert 표시
        const timer = setTimeout(() => {
            setIsVisible(false); // Alert 숨김
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer); // 타이머 정리
        }
    }, [open, duration, onClose]);

    if (!isVisible) return null;

    return (
        <StyledAlert icon={<CheckIcon fontSize="inherit" />} severity="success">
        {message}
        </StyledAlert>
    );
}

export default CommonAlert;
