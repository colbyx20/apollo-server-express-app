import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query($profId: String) {
    getProfessorsAppointments(profId: $profId) {
      _id
      groupName
      groupNumber
      room
      time
    }
  }
`;
