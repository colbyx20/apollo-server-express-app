import { gql } from "@apollo/client";

export const APPOINTMENTS = gql`
  query Query {
    getAllCoordinatorSchedule {
      _id
      attending
      attending2 {
        _id
        fullName
      }
      coordinatorInfo {
        _id
        coordinatorFName
        coordinatorLName
      }
      groupId {
        groupName
        groupNumber
        projectField
      }
      numberOfAttending
      room
      time
    }
  }
`;
