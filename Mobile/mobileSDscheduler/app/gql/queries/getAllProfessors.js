import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query {
    getAllProfessors {
      _id
      appointments {
        _id
        groupName
        groupNumber
        room
        time
      }
      availSchedule
      professorFName
      professorLName
    }
  }
`;
