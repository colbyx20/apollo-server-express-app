import React, { useContext, useEffect } from "react";
import AuthContext from "../auth/context";
import HomeStudentScreen from "./HomeProfessorScreen";
import HomeProfessorScreen from "./HomeProfessorScreen";

function HomeScreen(props) {
  const { user } = useContext(AuthContext);
  console.log("USER: ", user);
  return (
    <>
      {user.loginUser.privilege == "student" ? (
        <HomeStudentScreen></HomeStudentScreen>
      ) : (
        <HomeProfessorScreen></HomeProfessorScreen>
      )}
    </>
  );
}

export default HomeScreen;
