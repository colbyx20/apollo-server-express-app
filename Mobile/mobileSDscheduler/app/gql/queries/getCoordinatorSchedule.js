import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query($cid: String) {
    getCoordinatorSchedule(CID: $cid) {
      _id
      attending
      attending2 {
        _id
        fullName
      }
      groupId {
        groupName
        groupNumber
        projectField
      }
      room
      numberOfAttending
      time
    }
  }
`;
