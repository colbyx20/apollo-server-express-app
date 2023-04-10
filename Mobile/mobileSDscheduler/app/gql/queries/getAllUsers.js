import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query {
    getAllUsers {
      _id
      coordinatorId
      groupNumber
      role
      userFName
      userLName
    }
  }
`;
