import { gql } from "@apollo/client";

// Variables:
// {
//   "cancelation": {
//     "ApID": null,
//     "CancelerID": null,
//     "room": null,
//      "time": null,
//   }
// }
export const CANCEL_APPOINTMENT = gql`
  mutation Mutation($cancelation: cancelation) {
    cancelAppointment(cancelation: $cancelation)
  }
`;
