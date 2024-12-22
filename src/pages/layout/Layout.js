import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import S from "./style";
import Logo from "./_component/Logo/Logo";
import SearchBar from "./_component/SearchBar/SearchBar";
import UserStatus from "./_component/UserStatus/UserStatus";
import NavBar from "./_component/NavBar/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserStatus } from "../../modules/user";

const Layout = () => {
  // 최초 사용자가 토큰을 가지고 있는지 확인하고, 토큰 요청을 보낸다.
  // 토큰 요청시 만료되었다면 삭제하고, 만료가 되지 않았다면 자동으로 로그인 시킨다.
  const { isLogin, currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [jwtToken, setJwtToken] = useState(""); 
  const navigate = useNavigate();
  
  useEffect(() => {
    if(localStorage.getItem("jwtToken") || searchParams.get("jwtToken")){
      console.log("🚀 ~ useEffect ~ 소셜에만 반응해?:", jwtToken);
        setJwtToken(localStorage.getItem("jwtToken")|| searchParams.get("jwtToken")) 
        localStorage.setItem("jwtToken",jwtToken )
        navigate("/", {replace : true})
    }

    if(jwtToken){
      const isAuthenticate = async () => {
        const response = await fetch("http://localhost:8000/auth/jwt", {
          method : "POST",
          headers : {
            "Authorization" : `Bearer ${jwtToken}`
          }
        })
        const getAuthenticate = await response.json();
        return getAuthenticate;
      }

      isAuthenticate()
        .then((res) => {
          console.log(res)
          // 3) 화면에 뿌릴 수 있도록 유저정보를 파싱(redux)
          dispatch(setUser(res.user)) // currentUser
          dispatch(setUserStatus(true)) // isLogin
        })
        .catch(console.error)
    }
      
  }, [jwtToken])

  return (
    <S.BackGround>
      <S.Header> 
        <Logo />
        <SearchBar />
        <UserStatus/>
      </S.Header>

      <S.Wrapper>
        <S.Nav>
          <NavBar/>
        </S.Nav>

        <S.Main> 
          <Outlet/>  
        </S.Main>
      </S.Wrapper>

      <S.Footer> 푸터 </S.Footer>
    </S.BackGround>
  );
};

export default Layout;
