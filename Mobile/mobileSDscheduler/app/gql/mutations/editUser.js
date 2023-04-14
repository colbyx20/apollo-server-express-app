import { gql } from "@apollo/client";

// Variables:
// {
//   "id": null,
//   "userInput": {
//     "email": null,
//     "group": null,
//     "lastname": null,
//     "name": null,
//     "notificationEmail": null,
//     "password": null
//   }
// }
export const USER_EMAIL = gql`
  mutation Mutation($id: String!, $email: String!) {
    editNotificationEmail(ID: $id, email: $email)
  }
`;
