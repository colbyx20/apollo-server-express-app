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
  mutation Mutation($id: String!, $email: String!) {
    editNotificationEmail(ID: $id, email: $email)
  }
`;
