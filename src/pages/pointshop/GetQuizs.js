import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Form } from 'react-bootstrap';
import "../../styles/pointshop/GetQuizs.css";
import "../../styles/pointshop/AdminPointProducts.css";



const GetQuizs = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [newQuiz, setNewQuiz] = useState({
    quizContent: '',
    quizOption1: '',
    quizOption2: '',
    quizOption3: '',
    quizOption4: '',
    answer: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/api/pointshop/quizs');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleSaveQuiz = async () => {
    try {
      await axios.post('/api/pointshop/quizs', newQuiz);
      fetchQuizzes();
      setNewQuiz({
        quizContent: '',
        quizOption1: '',
        quizOption2: '',
        quizOption3: '',
        quizOption4: '',
        answer: '',
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const handleUpdateQuiz = async () => {
    try {
      await axios.put(`/api/pointshop/quizs/${editingQuiz.quizId}`, editingQuiz);
      fetchQuizzes();
      setEditingQuiz(null);
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`/api/pointshop/quizs/${quizId}`);
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingQuiz(null);
  };

  const handleEditChange = (field, value) => {
    setEditingQuiz({ ...editingQuiz, [field]: value });
  };

  const handleInputChange = (field, value) => {
    setNewQuiz({ ...newQuiz, [field]: value });
  };

  return (
    <div className="container mt-4">
      <h1 className="admin-title">퀴즈 관리</h1>
      {!isAdding && !editingQuiz && (
        <div className="mb-3 text-end">
          <button className="quiz-button add-button" onClick={() => setIsAdding(true)}>
            추가
          </button>
        </div>
      )}
      <Table bordered hover>
        <thead>
          <tr>
            <th>퀴즈 ID</th>
            <th>문제 및 보기</th>
            <th>정답</th>
            <th style={{ width: '120px', textAlign: 'center' }}>작업</th>
          </tr>
        </thead>
        <tbody>
          {isAdding && (
            <tr>
              <td></td>
              <td>
                <Form.Control
                  type="text"
                  value={newQuiz.quizContent}
                  onChange={(e) => handleInputChange('quizContent', e.target.value)}
                  placeholder="퀴즈 문제 입력"
                  className="mb-2"
                />
                {[1, 2, 3, 4].map((num) => (
                  <Form.Control
                    key={num}
                    type="text"
                    value={newQuiz[`quizOption${num}`]}
                    onChange={(e) => handleInputChange(`quizOption${num}`, e.target.value)}
                    className="mb-2"
                    placeholder={`보기 ${num} 입력`}
                  />
                ))}
              </td>
              <td>
                <Form.Select
                  value={newQuiz.answer}
                  onChange={(e) => handleInputChange('answer', e.target.value)}
                >
                  <option value="">정답 선택</option>
                  <option value="1">1번</option>
                  <option value="2">2번</option>
                  <option value="3">3번</option>
                  <option value="4">4번</option>
                </Form.Select>
              </td>
              <td className="button-container">
                <button className="quiz-button save-button" onClick={handleSaveQuiz}>
                  저장
                </button>
                <button className="quiz-button cancel-button" onClick={() => setIsAdding(false)}>
                  취소
                </button>
              </td>
            </tr>
          )}
          {quizzes.map((quiz, index) =>
            editingQuiz && editingQuiz.quizId === quiz.quizId ? (
              <tr key={index}>
                <td>{quiz.quizId}</td>
                <td>
                  <Form.Control
                    type="text"
                    value={editingQuiz.quizContent}
                    onChange={(e) => handleEditChange('quizContent', e.target.value)}
                    className="mb-2"
                  />
                  {[1, 2, 3, 4].map((num) => (
                    <Form.Control
                      key={num}
                      type="text"
                      value={editingQuiz[`quizOption${num}`]}
                      onChange={(e) => handleEditChange(`quizOption${num}`, e.target.value)}
                      className="mb-2"
                    />
                  ))}
                </td>
                <td>
                  <Form.Select
                    value={editingQuiz.answer}
                    onChange={(e) => handleEditChange('answer', e.target.value)}
                  >
                    <option value="">정답 선택</option>
                    <option value="1">1번</option>
                    <option value="2">2번</option>
                    <option value="3">3번</option>
                    <option value="4">4번</option>
                  </Form.Select>
                </td>
                <td className="button-container">
                  <button className="quiz-button save-button" onClick={handleUpdateQuiz}>
                    저장
                  </button>
                  <button className="quiz-button cancel-button" onClick={handleCancelEdit}>
                    취소
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={index}>
                <td>{quiz.quizId}</td>
                <td>
                  <div>{quiz.quizContent}</div>
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num}>{`${num}. ${quiz[`quizOption${num}`]}`}</div>
                  ))}
                </td>
                <td>{quiz.answer}</td>
                <td className="table-cell">
                <div className="button-container">
                  <button className="quiz-button edit-button" onClick={() => setEditingQuiz(quiz)}>
                    수정
                  </button>
                  <button
                    className="quiz-button delete-button"
                    onClick={() => handleDeleteQuiz(quiz.quizId)}
                  >
                    삭제
                  </button>
                </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default GetQuizs;
