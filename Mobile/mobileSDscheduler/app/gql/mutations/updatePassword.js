import { gql } from "@apollo/client";

// Variables:
// {
//   "id": null,
//   "oldPassword": null,
//   "newPassword": null,
//   "confirmedPassword": null
// }
export const GROUPS = gql`
  mutation Mutation(
    $id: String!
    $oldPassword: String!
    $newPassword: String!
    $confirmedPassword: String!
  ) {
    updatePassword(
      ID: $id
      oldPassword: $oldPassword
      newPassword: $newPassword
      confirmedPassword: $confirmedPassword
    )
  }
`;
