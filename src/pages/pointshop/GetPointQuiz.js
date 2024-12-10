import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";

const GetPointQuiz = () => {
  const [quizzes, setQuizzes] = useState([]); // 퀴즈 데이터
  const [userAnswers, setUserAnswers] = useState({}); // 사용자가 선택한 답안
  const [showResults, setShowResults] = useState(false); // 결과 표시 여부
  const [score, setScore] = useState(0); // 총 점수
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(`/${path}`);
  };
  // API에서 퀴즈 가져오기
  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.40:8000/api/pointshop/quizs/getRandomQuizs?userId=user01"
      );
      setQuizzes(response.data);
      setUserAnswers({});
      setShowResults(false);
      setScore(0);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // 사용자가 답안을 선택할 때 처리
  const handleAnswerChange = (quizId, answer) => {
    setUserAnswers({
      ...userAnswers,
      [quizId]: answer,
    });
  };

  // 제출 버튼 클릭 시 결과 표시 및 점수 계산
  const handleSubmit = () => {
    let calculatedScore = 0;

    quizzes.forEach((quiz) => {
      if (userAnswers[quiz.quizId] === quiz.answer) {
        calculatedScore += 10; // 1문제당 10점
      }
    });

    setScore(calculatedScore);
    setShowResults(true);
  };

  return (
    <div className="container mt-4">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>퀴즈 ID</th>
            <th>퀴즈 문제</th>
            <th>보기</th>
            <th>정답 선택</th>
            {showResults && <th>결과</th>}
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.quizId}>
              <td>{quiz.quizId}</td>
              <td>{quiz.quizContent}</td>
              <td>
                {[1, 2, 3, 4].map((num) => (
                  <div key={num}>
                    {num}. {quiz[`quizOption${num}`]}
                  </div>
                ))}
              </td>
              <td>
                <Form.Select
                  value={userAnswers[quiz.quizId] || ""}
                  onChange={(e) =>
                    handleAnswerChange(quiz.quizId, parseInt(e.target.value))
                  }
                  disabled={showResults}
                >
                  <option value="">답 선택</option>
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      {num}번
                    </option>
                  ))}
                </Form.Select>
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
        <div className="mt-4">
          <h3>총 점수: {score}점</h3>
          {score < 70 ? (
            <Button
              variant="warning"
              onClick={fetchQuizzes}
              className="me-2"
            >
              다시 도전
            </Button>
          ) : (
            <Button variant="success" onClick={() => handleNavigation("pointLog")}>
              종료
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default GetPointQuiz;
