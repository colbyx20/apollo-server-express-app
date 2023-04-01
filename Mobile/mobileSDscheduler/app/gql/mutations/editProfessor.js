import { gql } from "@apollo/client";

// Variables:
// {
//   "id": null,
//   "professorInput": {
//     "coordinator": null,
//     "email": null,
//     "fieldOfInterest": null,
//     "firstname": null,
//     "lastname": null,
//     "password": null
//   }
// }
export const GROUPS = gql`
  mutation Mutation($id: ID!, $professorInput: ProfessorInput) {
    editProfessor(ID: $id, professorInput: $professorInput) {
      _id
      appointments {
        _id
        time
        room
        groupName
        groupNumber
      }
      availSchedule
      professorFName
      professorLName
    }
  }
`;
