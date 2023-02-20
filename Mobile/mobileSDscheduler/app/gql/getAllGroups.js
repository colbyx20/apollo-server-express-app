import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query {
    getAllGroups {
      groupName
      _id
    }
  }
`;
