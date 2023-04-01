import { gql } from "@apollo/client";

// Variables:
// {
//   "resetPassword": {
//     "confirmPassword": null,
//     "email": null,
//     "password": null
//   }
// }
export const GROUPS = gql`
  mutation Mutation($resetPassword: resetPassword) {
    resetPassword(resetPassword: $resetPassword)
  }
`;
