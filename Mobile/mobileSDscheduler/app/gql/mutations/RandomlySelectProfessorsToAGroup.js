import { gql } from "@apollo/client";

// Variables:
// {
//   "cid": null
// }
export const GROUPS = gql`
  mutation Mutation($cid: ID!) {
    RandomlySelectProfessorsToAGroup(CID: $cid)
  }
`;
