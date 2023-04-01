import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query($coordinatorId: String) {
    getGroupsByCoordinator(coordinatorId: $coordinatorId) {
      _id
      coordinatorId
      groupName
      groupNumber
      projectField
    }
  }
`;
