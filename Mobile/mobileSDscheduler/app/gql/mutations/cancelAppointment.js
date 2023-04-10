import { gql } from "@apollo/client";

// Variables:
// {
//   "cancelation": {
//     "ApID": null,
//     "CancelerID": null,
//     "reason": null
//   }
// }
export const GROUPS = gql`
  mutation Mutation($cancelation: cancelation) {
    cancelAppointment(cancelation: $cancelation)
  }
`;
