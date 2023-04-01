import { gql } from "@apollo/client";

// Variables:
// {
//   "cid": null,
//   "newRoom": null
// }
export const GROUPS = gql`
  mutation Mutation($cid: ID!, $newRoom: String) {
    roomChange(CID: $cid, newRoom: $newRoom) {
      _id
      attending
      coordinatorID
      groupId
      room
      time
    }
  }
`;
