import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query($studentId: String) {
    getGroupMembers(studentId: $studentId) {
      _id
      coordinatorId
      groupName
      groupNumber
      members {
        _id
        userFName
        userLName
        role
      }
    }
  }
`;
