import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Form } from 'react-bootstrap';
import "../../styles/pointshop/GetQuizs.css";
import { showErrorToast, showSuccessToast } from "../../components/common/alert/CommonToast";

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

  if (!newQuiz.quizContent.trim()) {
    showErrorToast("퀴즈 내용을 입력해주세요.");
    return;
  }

  const emptyOption = [1, 2, 3, 4].find((i) => !newQuiz[`quizOption${i}`].trim());
  if (emptyOption) {
    showErrorToast(`보기 ${emptyOption}를 입력해주세요.`);
    return;
  }

  if (!newQuiz.answer) {
    showErrorToast("정답을 선택해주세요.");
    return;
  }

    
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
      <h1 className="admin-title" style={{
        textAlign: 'center',
        color: '#febe98',
        fontSize: '2.2rem',
        fontWeight: 'bold',
        marginBottom: '20px',
      }}>퀴즈 관리</h1>

      {!isAdding && !editingQuiz && (
        <div className="mb-3 text-end">
          <button className="quiz-button add-button" onClick={() => setIsAdding(true)} style={{ fontSize: '16px' }}>
            추가
          </button>
        </div>
      )}

      <Table bordered hover>
        <thead>
          <tr>
            <th style={{ textAlign: 'center', fontSize: '16px' }}>퀴즈 ID</th>
            <th style={{ textAlign: 'center', fontSize: '16px' }}>문제 및 보기</th>
            <th style={{ textAlign: 'center', fontSize: '16px' }}>정답</th>
            <th style={{ width: '120px', textAlign: 'center', fontSize: '16px' }}>수정/삭제/저장</th>
          </tr>
        </thead>
        <tbody>
          {isAdding && (
            <tr>
              <td colSpan={4}>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={newQuiz.quizContent}
                  onChange={(e) => handleInputChange('quizContent', e.target.value)}
                  placeholder="퀴즈 문제 입력"
                  className="mb-2"
                  style={{ fontSize: '18px' }}
                />
                {[1, 2, 3, 4].map((num) => (
                  <Form.Control
                    key={num}
                    type="text"
                    value={newQuiz[`quizOption${num}`]}
                    onChange={(e) => handleInputChange(`quizOption${num}`, e.target.value)}
                    className="mb-2"
                    placeholder={`보기 ${num} 입력`}
                    style={{ fontSize: '16px' }}
                  />
                ))}
                <Form.Select
                  value={newQuiz.answer}
                  onChange={(e) => handleInputChange('answer', e.target.value)}
                  className="mt-2"
                >
                  <option value="">정답 선택</option>
                  <option value="1">1번</option>
                  <option value="2">2번</option>
                  <option value="3">3번</option>
                  <option value="4">4번</option>
                </Form.Select>
                <div className="button-container mt-3">
                  <button className="quiz-button save-button" onClick={handleSaveQuiz}>
                    저장
                  </button>
                  <button className="quiz-button cancel-button" onClick={() => setIsAdding(false)}>
                    취소
                  </button>
                </div>
              </td>
            </tr>
          )}

          {quizzes.map((quiz, index) => (
            editingQuiz && editingQuiz.quizId === quiz.quizId ? (
              <tr key={index}>
                <td colSpan={4}>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={editingQuiz.quizContent}
                    onChange={(e) => handleEditChange('quizContent', e.target.value)}
                    className="mb-2"
                    style={{ fontSize: '18px' }}
                  />
                  {[1, 2, 3, 4].map((num) => (
                    <Form.Control
                      key={num}
                      type="text"
                      value={editingQuiz[`quizOption${num}`]}
                      onChange={(e) => handleEditChange(`quizOption${num}`, e.target.value)}
                      className="mb-2"
                      style={{ fontSize: '16px' }}
                    />
                  ))}
                  <Form.Select
                    value={editingQuiz.answer}
                    onChange={(e) => handleEditChange('answer', e.target.value)}
                    className="mt-2"
                  >
                    <option value="">정답 선택</option>
                    <option value="1">1번</option>
                    <option value="2">2번</option>
                    <option value="3">3번</option>
                    <option value="4">4번</option>
                  </Form.Select>
                  <div className="button-container mt-3">
                    <button className="quiz-button save-button" onClick={handleUpdateQuiz}>
                      저장
                    </button>
                    <button className="quiz-button cancel-button" onClick={handleCancelEdit}>
                      취소
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={index}>
                <td>{quiz.quizId}</td>
                <td>
                  <div style={{ fontSize: '16px' }}>{quiz.quizContent}</div>
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} style={{ fontSize: '15px' }}>{`${num}. ${quiz[`quizOption${num}`]}`}</div>
                  ))}
                </td>
                <td>{quiz.answer}</td>
                <td className="table-cell">
                  <div className="button-container">
                    <button className="quiz-button edit-button" onClick={() => setEditingQuiz(quiz)} style={{ fontSize: '16px' }}>
                      수정
                    </button>
                    <button
                      className="quiz-button delete-button"
                      onClick={() => handleDeleteQuiz(quiz.quizId)}
                      style={{ fontSize: '16px' }}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GetQuizs;