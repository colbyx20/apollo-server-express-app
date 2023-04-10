import { gql } from "@apollo/client";

// Variables:
// {
//   "confirmEmail": {
//     "email": null
//   }
// }
export const GROUPS = gql`
  mutation Mutation($confirmEmail: confirmEmail) {
    confirmEmail(confirmEmail: $confirmEmail)
  }
`;
