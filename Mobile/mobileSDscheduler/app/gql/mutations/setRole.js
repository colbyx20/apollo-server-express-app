import { gql } from "@apollo/client";

// Variables:
// {
//   "cid": null,
//   "role": null
// }
export const GROUPS = gql`
  mutation Mutation($cid: String!, $role: String!) {
    setRole(CID: $cid, role: $role)
  }
`;
