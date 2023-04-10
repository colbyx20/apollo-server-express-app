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
export const GROUPS = gql`
  mutation Mutation($id: ID!, $userInput: UserInput) {
    editUser(ID: $id, userInput: $userInput) {
      _id
      coordinatorId
      groupNumber
      role
      userFName
      userLName
    }
  }
`;
