import React from "react";
import { IconButton, Typography, Box } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const CashbookYearNav = ({ year, setYear }) => {
  const handlePrevYear = () => {
    setYear((prevYear) => prevYear - 1); // 연도 감소
  };

  const handleNextYear = () => {
    setYear((prevYear) => prevYear + 1); // 연도 증가
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap="10px"
      padding="5px"
    >
      <IconButton onClick={handlePrevYear} aria-label="Previous Year">
        <ArrowBackIosIcon />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
        {year} {/* 현재 연도 */}
      </Typography>
      <IconButton onClick={handleNextYear} aria-label="Next Year">
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default CashbookYearNav;
