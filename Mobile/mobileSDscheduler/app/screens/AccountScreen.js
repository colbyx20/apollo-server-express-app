import React, { useContext, useEffect } from "react";
import AuthContext from "../auth/context";
import AccountProfessorScreen from "./AccountProfessorScreen";
import AccountStudentScreen from "./AccountStudentScreen";

function AccountScreen(props) {
  const { user } = useContext(AuthContext);
  return (
    <>
      {user.loginUser.privilege == "student" ? (
        <AccountStudentScreen></AccountStudentScreen>
      ) : (
        <AccountProfessorScreen></AccountProfessorScreen>
      )}
    </>
  );
}

export default AccountScreen;
