import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query($id: ID!) {
    getUser(ID: $id) {
      _id
      coordinatorId
      groupNumber
      role
      userFName
      userLName
    }
  }
`;
