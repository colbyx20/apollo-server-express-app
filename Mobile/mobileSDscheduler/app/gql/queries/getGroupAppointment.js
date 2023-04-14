import { gql } from "@apollo/client";

export const APPOINTMENT = gql`
  query Query($studentId: String) {
    getGroupAppointment(studentId: $studentId) {
      _id
      attending
      attending2 {
        fullName
        _id
      }
      groupId {
        groupName
        groupNumber
        projectField
      }
      numberOfAttending
      room
      time
    }
  }
`;
