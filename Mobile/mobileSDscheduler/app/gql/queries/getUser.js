import { gql } from "@apollo/client";

export const USER = gql`
  query Query($id: ID!, $id2: String!) {
    getUser(ID: $id) {
      _id
      coordinatorId
      groupNumber
      role
      userFName
      userLName
    }
    getUserInfo(ID: $id2) {
      notificationEmail
      email
    }
  }
`;
