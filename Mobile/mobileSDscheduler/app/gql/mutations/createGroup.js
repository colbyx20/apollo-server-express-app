import { gql } from "@apollo/client";

// Variables:
// {
//   "cid": null,
//   "groupNumber": null,
//   "groupName": null
// }
export const GROUPS = gql`
  mutation Mutation($cid: ID!, $groupNumber: Int, $groupName: String) {
    createGroup(CID: $cid, groupNumber: $groupNumber, groupName: $groupName)
  }
`;
