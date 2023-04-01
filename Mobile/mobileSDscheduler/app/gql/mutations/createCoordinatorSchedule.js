import { gql } from "@apollo/client";

// Variables:
// {
//   "coordinatorSInput": null
// }
export const GROUPS = gql`
  mutation Mutation($coordinatorSInput: coordinatorSInput) {
    createCoordinatorSchedule(coordinatorSInput: $coordinatorSInput) {
      _id
      attending
      coordinatorID
      groupId
      room
      time
    }
  }
`;
