import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query($id: String!) {
    getUserInfo(ID: $id) {
      coordinator
      email
      notificationEmail
      userId
    }
  }
`;
