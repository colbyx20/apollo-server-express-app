import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query($id: ID!) {
    getProfessor(ID: $id) {
      _id
      availSchedule
      appointments {
        _id
        time
        room
        groupName
        groupNumber
      }
      professorFName
      professorLName
    }
  }
`;
