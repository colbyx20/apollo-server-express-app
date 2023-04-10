import { gql } from "@apollo/client";

// Variables:
// {
//   "id": null,
//   "email": null,
//   "privilege": null
// }
export const GROUPS = gql`
  mutation Mutation($id: String!, $email: String!, $privilege: String!) {
    sendEventEmail(ID: $id, email: $email, privilege: $privilege)
  }
`;
