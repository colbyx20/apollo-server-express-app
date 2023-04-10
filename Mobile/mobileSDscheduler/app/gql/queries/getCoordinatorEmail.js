import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query($id: ID!) {
    getCoordinatorEmail(ID: $id) {
      _id
      notificationEmail
    }
  }
`;
