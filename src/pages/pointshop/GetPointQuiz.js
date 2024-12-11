import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";
import { useUser } from "../../components/contexts/UserContext";

const GetPointQuiz = () => {
  const [quizzes, setQuizzes] = useState([]); // 퀴즈 데이터
  const [userAnswers, setUserAnswers] = useState({}); // 사용자가 선택한 답안
  const [showResults, setShowResults] = useState(false); // 결과 표시 여부
  const [score, setScore] = useState(0); // 총 점수
  const [resultMessage, setResultMessage] = useState(""); // 결과 메시지
  const { userId } = useUser(); // UserContext에서 userId 가져오기
  const navigate = useNavigate();

  // 로그인 확인
  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 리디렉션
    }
  }, [userId, navigate]);

  // API에서 랜덤 퀴즈 가져오기
  const fetchQuizzes = async () => {
    if (!userId) return; // userId가 없으면 실행하지 않음

    try {
      const response = await axios.get(
        `http://192.168.0.40:8000/api/pointshop/quizs/getRandomQuizs`,
        {
          params: { userId }, // userId를 쿼리 파라미터로 전달
        }
      );
      setQuizzes(response.data);
      setUserAnswers({});
      setShowResults(false);
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

  // 사용자가 답안을 선택할 때 처리
  const handleAnswerChange = (quizId, answer) => {
    setUserAnswers({
      ...userAnswers,
      [quizId]: answer,
    });
  };

  // 제출 버튼 클릭 시 결과 표시 및 점수 계산
  const handleSubmit = async () => {
    if (!userId) return;

    try {
      const submittedAnswers = quizzes.map((quiz) => ({
        quizId: quiz.quizId,
        answer: userAnswers[quiz.quizId] || null,
      }));

      const response = await axios.post(
        "http://192.168.0.40:8000/api/pointshop/quizs/submit",
        {
          userId,
          submittedAnswers,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { data } = response;

      let calculatedScore = 0;
      quizzes.forEach((quiz) => {
        if (userAnswers[quiz.quizId] === quiz.answer) {
          calculatedScore += 10; // 1문제당 10점
        }
      });

      setScore(calculatedScore);
      setShowResults(true);

      // 결과 메시지 설정
      setResultMessage(calculatedScore >= 70 ? "통과" : "탈락");
    } catch (error) {
      console.error("Error submitting quiz answers:", error);
      setResultMessage("퀴즈 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="container mt-4">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>번호</th>
            <th>퀴즈 문제</th>
            {showResults && <th>결과</th>}
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr key={quiz.quizId}>
              <td>{index + 1}</td>
              <td>
                <div>{quiz.quizContent}</div>
                {[1, 2, 3, 4].map((num) => (
                  <Form.Check
                    type="radio"
                    id={`quiz-${quiz.quizId}-option-${num}`}
                    key={num}
                    name={`quiz-${quiz.quizId}`}
                    label={`${num}. ${quiz[`quizOption${num}`]}`}
                    value={num}
                    checked={userAnswers[quiz.quizId] === num}
                    onChange={() => handleAnswerChange(quiz.quizId, num)}
                    disabled={showResults}
                  />
                ))}
              </td>
              {showResults && (
                <td>
                  {userAnswers[quiz.quizId] === quiz.answer ? (
                    <span style={{ color: "green" }}>정답</span>
                  ) : (
                    <span style={{ color: "red" }}>
                      오답 (정답: {quiz.answer}번)
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      {!showResults && (
        <Button variant="primary" onClick={handleSubmit}>
          제출
        </Button>
      )}
      {showResults && (
        <div className="mt-4 text-center">
          <h3>총 점수: {score}점</h3>
          <h4>{resultMessage}</h4>
          {resultMessage === "탈락" ? (
            <Button variant="warning" onClick={fetchQuizzes} className="me-2">
              다시 도전
            </Button>
          ) : null}
          <Button variant="success" onClick={() => navigate("/pointLog")}>
            종료
          </Button>
        </div>
      )}
    </div>
  );
};

export default GetPointQuiz;
