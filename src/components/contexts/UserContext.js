import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [nickname, setNickname] = useState(null); 
  const [myPoint, setMyPoint] = useState(0);
  const [userRole, setUserRole] = useState(null); //userRole 추가

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post("/api/users/test",      
          {}, 
          { withCredentials: true });
          console.log("Fetched User Data:", response.data);
          setUserId(response.data.userId); //userId 설정
          setNickname(response.data.nickname); //nickname 설정
          setMyPoint(response.data.myPoint);  //myPoint 설정
          setUserRole(response.data.role);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        //인증 실패시 초기화
        setUserId(null);
        setNickname(null);
        setMyPoint(0);
        setUserRole(null);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userId, nickname, myPoint, userRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

/*
전제흐름
1. UserContext.js
withCredentials: true 
===> 쿠키 기반으로 userId 가져오기/ 쿠키 사용하려면 반드시 withCredentials: true 추가해야함
useEffect
===> component로드 시 userId 가져옴
userId, setUderId
===> 상태관리(다른 컴포에서도 userId 사용가능)

2. App.js
<UserProvider>
  최상단에 감싸게해서 모든 하위 컴포가 컨텍스트 참조가능
  로그인 상태가 필요한 경우
    ===> 필요한 컴포에서import { useUser } from "../../../components/contexts/UserContext";
        호출해서 사용자 정보 가져오기 가능
</UserProvider>


3. 각자 컴포
1) step 1 : useUser를 사용해 로그인된 사용자 정보 참조하기(훅 통해서 userId 참조)
import { useUser } from "../../../components/contexts/UserContext";

2) step2 : 사용자 Id 가져오기
const { userId } = useUser();

3) step3 : userId만 가져와서 잘 쓰기
주의점
--> 로그인 상태체크(로그인페이지로 네비게이션 위한)부터하면 에러왕창나요
--> userId를 먼저 불어와주고 로그인체크로 넘어가주세요
--> 예시는 Favorite.js에 있습니다.

2021.12.11
4. UserRole추가했습니다.

*/
