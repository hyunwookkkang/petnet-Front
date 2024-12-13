import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, ProgressBar, Alert, Table } from "react-bootstrap";
import { Box, Button as MUIButton } from "@mui/material";
import { useUser } from "../../components/contexts/UserContext";

const GetPointQuiz = () => {
  const [quizzes, setQuizzes] = useState([]); // 전체 퀴즈 데이터
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 문제 인덱스
  const [userAnswers, setUserAnswers] = useState({}); // 사용자가 선택한 답안
  const [score, setScore] = useState(0); // 총 점수
  const [resultMessage, setResultMessage] = useState(""); // 결과 메시지
  const { userId } = useUser(); // UserContext에서 userId 가져오기
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false); // 로그인 모달 상태

  useEffect(() => {
    if (!userId) {
      setShowAlert(true);
    }
  }, [userId]);

  const fetchQuizzes = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`/api/pointshop/quizs/getRandomQuizs`, {
        params: { userId },
      });
      setQuizzes(response.data);
      setCurrentIndex(0);
      setUserAnswers({});
      setScore(0);
      setResultMessage("");
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchQuizzes();
    }
  }, [userId]);

  const handleAnswerSelection = (selectedAnswer) => {
    const currentQuiz = quizzes[currentIndex];
    const isCorrect = selectedAnswer === currentQuiz.answer;

    setUserAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuiz.quizId]: selectedAnswer }));

    if (isCorrect) {
      setScore((prevScore) => prevScore + 10); // 정답 시 점수 추가
    }

    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setResultMessage(
        score + (isCorrect ? 10 : 0) >= 70
          ? "축하합니다! 통과하셨습니다!"
          : "아쉽습니다. 다시 도전하세요!"
      );
    }
  };

  const handleRetry = () => {
    fetchQuizzes();
  };

  const currentQuiz = quizzes[currentIndex];

  return (
    <Box className="quiz-container" sx={{ padding: "20px", maxWidth: "800px", margin: "auto", backgroundColor: "#F7F6F2", borderRadius: "12px", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)" }}>
      <h2 className="quiz-title text-center mb-4" style={{ color: "#FF6347", fontWeight: "bold" }}>🎉 포인트 퀴즈 🎉</h2>

      {showAlert && (
        <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
          로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.
        </Alert>
      )}

      {currentQuiz && !resultMessage ? (
        <Card className="quiz-card mb-4" style={{ borderColor: "#FEBE98", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)", backgroundColor: "#FFFFFF" }}>
          <Card.Body>
            <Card.Title className="text-center mb-3" style={{ color: "#FF6347", fontSize: "1.5rem" }}>
              문제 {currentIndex + 1} / {quizzes.length}
            </Card.Title>
            <Card.Text className="quiz-question text-center mb-4" style={{ fontSize: "1.2rem", color: "#34495E" }}>
              {currentQuiz.quizContent}
            </Card.Text>
            <div className="quiz-options text-center">
              {[1, 2, 3, 4].map((num) => (
                <MUIButton
                  key={num}
                  variant="contained"
                  color="info"
                  onClick={() => handleAnswerSelection(num)}
                  sx={{ margin: "10px auto", padding: "12px 20px", width: "80%", backgroundColor: userAnswers[currentQuiz.quizId] === num ? "#FF6347" : "#FFFFFF", color: userAnswers[currentQuiz.quizId] === num ? "#FFFFFF" : "#34495E", fontWeight: "bold", borderRadius: "8px", border: "2px solid #FEBE98" }}
                >
                  {num}. {currentQuiz[`quizOption${num}`]}
                </MUIButton>
              ))}
            </div>

            <div className="text-center mt-3">
              {currentIndex > 0 && (
                <Button
                  onClick={() => setCurrentIndex((prevIndex) => prevIndex - 1)}
                  variant="secondary"
                  className="me-2"
                  style={{ backgroundColor: "#DCDCDC", borderColor: "#DCDCDC", color: "#34495E" }}
                >
                  뒤로 가기
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      ) : resultMessage ? (
        <div className="quiz-results text-center mt-4">
          <h3 className="quiz-score" style={{ color: "#FF6347", fontWeight: "bold" }}>총 점수: {score}점</h3>
          <ProgressBar
            now={(score / (quizzes.length * 10)) * 100}
            label={`${score}%`}
            className="quiz-progress my-3"
            style={{ height: "25px", fontSize: "1rem", backgroundColor: "#EDEDED" }}
          />
          <Alert variant={score >= 70 ? "success" : "danger"} style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{resultMessage}</Alert>

          <Table bordered hover className="mt-4" style={{ backgroundColor: "#FFFFFF" }}>
            <thead style={{ backgroundColor: "#FF6347", color: "white" }}>
              <tr>
                <th>문제</th>
                <th>사용자 답안</th>
                <th>정답</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.quizId} style={{ backgroundColor: "#F7F9F9" }}>
                  <td style={{ color: "#34495E" }}>{quiz.quizContent}</td>
                  <td
                    style={{
                      color: userAnswers[quiz.quizId] === quiz.answer ? "#27AE60" : "#E74C3C",
                      fontWeight: "bold",
                    }}
                  >
                    {userAnswers[quiz.quizId]
                      ? `${userAnswers[quiz.quizId]}. ${quiz[`quizOption${userAnswers[quiz.quizId]}`]}`
                      : "미응답"}
                  </td>
                  <td style={{ color: "#34495E", fontWeight: "bold" }}>{`${quiz.answer}. ${quiz[`quizOption${quiz.answer}`]}`}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="quiz-actions mt-3">
            {score < 70 && (
              <Button
                variant="warning"
                onClick={handleRetry}
                className="me-2"
                style={{ backgroundColor: "#ECB392", borderColor: "#ECB392", color: "#FFFFFF" }}
              >
                다시 도전
              </Button>
            )}
            <Button
              variant="success"
              onClick={() => navigate("/pointLog")}
              style={{ backgroundColor: "#EEA092", borderColor: "#EEA092", color: "#FFFFFF" }}
            >
              종료하기
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center" style={{ color: "#7F8C8D", fontSize: "1.2rem" }}>퀴즈를 불러오는 중입니다...</p>
      )}
    </Box>
  );
};

export default GetPointQuiz;
