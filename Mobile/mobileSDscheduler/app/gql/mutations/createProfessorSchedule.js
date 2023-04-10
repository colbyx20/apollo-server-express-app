import { gql } from "@apollo/client";

// Variables:
// {
//   "id": null,
//   "privilege": null,
//   "professorScheduleInput": {
//     "time": null
//   }
// }
export const GROUPS = gql`
  mutation Mutation(
    $id: ID!
    $privilege: String!
    $professorScheduleInput: ProfessorScheduleInput
  ) {
    createProfessorSchedule(
      ID: $id
      privilege: $privilege
      professorScheduleInput: $professorScheduleInput
    )
  }
`;
