import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";

const QuizSubmission = () => {
  const [quizzes, setQuizzes] = useState([]); // 퀴즈 데이터
  const [userAnswers, setUserAnswers] = useState({}); // 사용자가 선택한 답안
  const [showResults, setShowResults] = useState(false); // 결과 표시 여부

  // API에서 퀴즈 가져오기
  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(
        "/api/pointshop/quizs/getRandomQuizs?userId=user01"
      );
      setQuizzes(response.data);
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

  // 제출 버튼 클릭 시 결과 표시
  const handleSubmit = () => {
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
                    <span style={{ color: "red" }}>오답</span>
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
    </div>
  );
};

export default GetQuizAnswer;
