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
export const PROFESSOR_EMAIL = gql`
  mutation Mutation(
    $professorInput: ProfessorInput
    $editNotificationEmailId2: String!
    $email: String!
    $id: ID!
  ) {
    editProfessor(professorInput: $professorInput, ID: $id) {
      _id
    }
    editNotificationEmail(ID: $editNotificationEmailId2, email: $email)
  }
`;
