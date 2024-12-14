import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, ProgressBar, Alert, Table } from "react-bootstrap";
import { Box, Button as MUIButton } from "@mui/material";
import { useUser } from "../../components/contexts/UserContext";
import "../../styles/pointshop/GetPointQuiz.css"; // CSS 파일 import

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
    <Box className="quiz-container">
      <h2 className="quiz-title text-center mb-4">🎉 포인트 퀴즈 🎉</h2>

      {showAlert && (
        <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
          로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.
        </Alert>
      )}

      {currentQuiz && !resultMessage ? (
        <Card className="quiz-card mb-4">
          <Card.Body>
            <Card.Title className="quiz-progress-title text-center mb-3">
              문제 {currentIndex + 1} / {quizzes.length}
            </Card.Title>
            <Card.Text className="quiz-question text-center mb-4">
              {currentQuiz.quizContent}
            </Card.Text>
            <div className="quiz-options text-center">
              {[1, 2, 3, 4].map((num) => (
                <MUIButton
                  key={num}
                  variant="contained"
                  color="info"
                  onClick={() => handleAnswerSelection(num)}
                  className={`quiz-option-btn ${
                    userAnswers[currentQuiz.quizId] === num ? "selected" : ""
                  }`}
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
                  className="back-button me-2"
                >
                  뒤로 가기
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      ) : resultMessage ? (
        <div className="quiz-results text-center mt-4">
          <h3 className="quiz-score">총 점수: {score}점</h3>
          <ProgressBar
            now={(score / (quizzes.length * 10)) * 100}
            label={`${score}%`}
            className="quiz-progress my-3"
            style={{
              height: "25px",
              fontSize: "1rem",
              backgroundColor: "#EDEDED",
            }}
          >
            <div
              style={{
                backgroundColor: "#FEBE98",
                width: `${(score / (quizzes.length * 10)) * 100}%`,
                height: "100%",
              }}
            ></div>
          </ProgressBar>
          <Alert
            variant={score >= 70 ? "success" : "danger"}
            className="quiz-result-alert"
          >
            {resultMessage}
          </Alert>

          <Table bordered hover className="quiz-result-table mt-4">
            <thead>
              <tr>
                <th>문제</th>
                <th>사용자 답안</th>
                <th>정답</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.quizId}>
                  <td>{quiz.quizContent}</td>
                  <td
                    style={{
                      color: userAnswers[quiz.quizId] === quiz.answer ? "#27AE60" : "#E74C3C",
                      fontWeight: "bold",
                    }}
                  >
                    {userAnswers[quiz.quizId]
                      ? `${userAnswers[quiz.quizId]}. ${
                          quiz[`quizOption${userAnswers[quiz.quizId]}`]
                        }`
                      : "미응답"}
                  </td>
                  <td>{`${quiz.answer}. ${quiz[`quizOption${quiz.answer}`]}`}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="quiz-actions mt-3">
            {score < 70 && (
              <Button variant="warning" onClick={handleRetry} className="retry-button me-2">
                다시 도전
              </Button>
            )}
            <Button
              variant="success"
              onClick={() => navigate("/pointLog")}
              className="end-button"
            >
              종료하기
            </Button>
          </div>
        </div>
      ) : (
        <p className="loading-text text-center">퀴즈를 불러오는 중입니다...</p>
      )}
    </Box>
  );
};

export default GetPointQuiz;
