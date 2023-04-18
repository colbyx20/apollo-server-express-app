import { gql } from "@apollo/client";

// Variables:
// {
//   "id": null,
//   "privilege": null,
//   "professorScheduleInput": {
//     "time": null
//   }
// }
export const AVAILABILITY = gql`
  mutation Mutation($id: ID!, $privilege: String!, $time: [String]) {
    createProfessorSchedule(ID: $id, privilege: $privilege, time: $time)
  }
`;
