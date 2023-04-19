import React, { useContext } from "react";
import AuthContext from "../auth/context";
import HomeStudentScreen from "./HomeStudentScreen";
import HomeProfessorScreen from "./HomeProfessorScreen";

function HomeScreen(props) {
  const { user } = useContext(AuthContext);
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
