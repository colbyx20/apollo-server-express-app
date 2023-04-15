import React, { useContext, useEffect } from "react";
import AuthContext from "../auth/context";
import CalendarStudentScreen from "./CalendarProfessorScreen";
import CalendarProfessorScreen from "./CalendarProfessorScreen";

function CalendarScreen(props) {
  const { user } = useContext(AuthContext);
  return (
    <>
      {user.loginUser.privilege == "student" ? (
        <CalendarStudentScreen></CalendarStudentScreen>
      ) : (
        <CalendarProfessorScreen></CalendarProfessorScreen>
      )}
    </>
  );
}

export default CalendarScreen;
