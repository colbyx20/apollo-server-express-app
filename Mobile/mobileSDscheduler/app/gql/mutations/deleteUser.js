import { gql } from "@apollo/client";

// Variables:
// {
//   "id": null
// }
export const GROUPS = gql`
  mutation Mutation($id: ID!) {
    deleteUser(ID: $id) {
      _id
      coordinatorId
      groupNumber
      role
      userFName
      userLName
    }
  }
`;
