import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';

const GetQuizs = () => {
  const [quizzes, setQuizzes] = useState([]); // API에서 가져온 퀴즈 데이터
  const [editingQuiz, setEditingQuiz] = useState(null); // 수정 중인 퀴즈
  const [newQuiz, setNewQuiz] = useState({
    quizContent: '',
    quizOption1: '',
    quizOption2: '',
    quizOption3: '',
    quizOption4: '',
    answer: ''
  }); // 새 퀴즈 추가를 위한 상태
  const [isAdding, setIsAdding] = useState(false);

  // API에서 퀴즈 데이터 가져오기
  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/api/pointshop/quizs');
      setQuizzes(response.data); // 서버에서 받아온 데이터를 상태에 반영
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 퀴즈 데이터 가져오기
  useEffect(() => {
    fetchQuizzes();
  }, []);

  // 새 퀴즈 추가
  const handleSaveQuiz = async () => {
    try {
      await axios.post('/api/pointshop/quizs', {
        quizContent: newQuiz.quizContent,
        quizOption1: newQuiz.quizOption1,
        quizOption2: newQuiz.quizOption2,
        quizOption3: newQuiz.quizOption3,
        quizOption4: newQuiz.quizOption4,
        answer: newQuiz.answer
      });
      fetchQuizzes();
      setNewQuiz({
        quizContent: '',
        quizOption1: '',
        quizOption2: '',
        quizOption3: '',
        quizOption4: '',
        answer: ''
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  // 수정된 퀴즈 저장
  const handleUpdateQuiz = async () => {
    try {
      await axios.put(`/api/pointshop/quizs/${editingQuiz.quizId}`, {
        quizContent: editingQuiz.quizContent,
        quizOption1: editingQuiz.quizOption1,
        quizOption2: editingQuiz.quizOption2,
        quizOption3: editingQuiz.quizOption3,
        quizOption4: editingQuiz.quizOption4,
        answer: editingQuiz.answer
      });
      fetchQuizzes();
      setEditingQuiz(null); // 수정 상태 종료
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  // 퀴즈 삭제
  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`/api/pointshop/quizs/${quizId}`);
      fetchQuizzes(); // 삭제 후 데이터 새로고침
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
      {!isAdding && !editingQuiz && (
        <div className="mb-3 text-end">
          <Button variant="primary" onClick={() => setIsAdding(true)}>
            추가
          </Button>
        </div>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>퀴즈 ID</th>
            <th>퀴즈 문제</th>
            <th>보기</th>
            <th>정답</th>
            <th>수정/삭제</th>
          </tr>
        </thead>
        <tbody>
          {/* 새 퀴즈 추가 입력 폼 */}
          {isAdding && (
            <tr>
              <td></td>
              <td>
                <Form.Control
                  type="text"
                  value={newQuiz.quizContent}
                  onChange={(e) => handleInputChange('quizContent', e.target.value)}
                  placeholder="퀴즈 문제 입력"
                />
              </td>
              <td>
                {[1, 2, 3, 4].map((num) => (
                  <Form.Control
                    key={num}
                    type="text"
                    value={newQuiz[`quizOption${num}`]}
                    onChange={(e) =>
                      handleInputChange(`quizOption${num}`, e.target.value)
                    }
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
              <td>
                <Button variant="success" onClick={handleSaveQuiz}>
                  저장
                </Button>{' '}
                <Button variant="danger" onClick={() => setIsAdding(false)}>
                  취소
                </Button>
              </td>
            </tr>
          )}
          {/* 기존 데이터 출력 */}
          {quizzes.map((quiz, index) => (
            editingQuiz && editingQuiz.quizId === quiz.quizId ? (
              <tr key={index}>
                <td>{quiz.quizId}</td>
                <td>
                  <Form.Control
                    type="text"
                    value={editingQuiz.quizContent}
                    onChange={(e) => handleEditChange('quizContent', e.target.value)}
                  />
                </td>
                <td>
                  {[1, 2, 3, 4].map((num) => (
                    <Form.Control
                      key={num}
                      type="text"
                      value={editingQuiz[`quizOption${num}`]}
                      onChange={(e) =>
                        handleEditChange(`quizOption${num}`, e.target.value)
                      }
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
                <td>
                  <Button variant="success" onClick={handleUpdateQuiz}>
                    저장
                  </Button>{' '}
                  <Button variant="danger" onClick={handleCancelEdit}>
                    취소
                  </Button>
                </td>
              </tr>
            ) : (
              <tr key={index}>
                <td>{quiz.quizId}</td>
                <td>{quiz.quizContent}</td>
                <td>
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num}>{`${num}. ${quiz[`quizOption${num}`]}`}</div>
                  ))}
                </td>
                <td>{quiz.answer}</td>
                <td>
                  <Button variant="warning" onClick={() => setEditingQuiz(quiz)}>
                    수정
                  </Button>{' '}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteQuiz(quiz.quizId)}
                  >
                    삭제
                  </Button>
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
