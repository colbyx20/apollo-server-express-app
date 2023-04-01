import { gql } from "@apollo/client";

// Variables:
// {
//   "cid": null,
//   "gid": null,
//   "time": null
// }
export const GROUPS = gql`
  mutation Mutation($cid: ID!, $gid: ID!, $time: DateTime) {
    groupSelectAppointmentTime(CID: $cid, GID: $gid, time: $time)
  }
`;
