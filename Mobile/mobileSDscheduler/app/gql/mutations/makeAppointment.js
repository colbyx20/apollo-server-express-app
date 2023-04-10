import { gql } from "@apollo/client";

// Variables:
// {
//   "appointmentEdit": {
//     "CID": null,
//     "GID": null,
//     "professorsAttending": null,
//     "time": null
//   }
// }
export const GROUPS = gql`
  mutation Mutation($appointmentEdit: appointmentEdit) {
    makeAppointment(AppointmentEdit: $appointmentEdit) {
      _id
      attending
      coordinatorID
      groupId
      room
      time
    }
  }
`;
