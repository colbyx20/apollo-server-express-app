import { gql } from "@apollo/client";

// Variables:
// {
//   "id": null
// }
export const GROUPS = gql`
  mutation Mutation($id: ID!) {
    deleteProfessor(ID: $id) {
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
