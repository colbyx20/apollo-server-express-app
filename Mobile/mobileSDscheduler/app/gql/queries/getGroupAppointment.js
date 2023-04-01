import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query($studentId: String) {
    getGroupAppointment(studentId: $studentId) {
      _id
      attending
      attending2 {
        _id
        fullName
      }
      groupId {
        groupName
        groupNumber
        projectField
      }
      numberOfAttending
      time
      room
    }
  }
`;
