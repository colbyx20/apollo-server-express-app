import { gql } from "@apollo/client";

// Variables:
// {
//   "professorId": null,
//   "scheduleId": null
// }
export const GROUPS = gql`
  mutation Mutation($professorId: String, $scheduleId: String) {
    deleteProfessorAppointment(
      professorId: $professorId
      scheduleId: $scheduleId
    )
  }
`;
