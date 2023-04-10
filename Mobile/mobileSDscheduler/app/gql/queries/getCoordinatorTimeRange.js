import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query($cid: String) {
    getCoordinatorTimeRange(CID: $cid)
  }
`;
