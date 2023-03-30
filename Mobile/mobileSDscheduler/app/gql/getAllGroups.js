import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query {
    getAllGroups {
      _id
      coordinatorId
      groupName
      groupNumber
      projectField
    }
  }
`;
