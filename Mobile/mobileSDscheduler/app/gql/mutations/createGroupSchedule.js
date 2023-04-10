import { gql } from "@apollo/client";

// Variables:
// {
//   "groupSchedule": {
//     "appointmentTime": null
//   }
// }
export const GROUPS = gql`
  mutation Mutation($groupSchedule: groupSchedule) {
    createGroupSchedule(groupSchedule: $groupSchedule)
  }
`;
