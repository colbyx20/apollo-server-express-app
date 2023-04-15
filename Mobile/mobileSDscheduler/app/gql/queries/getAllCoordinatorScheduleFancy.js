import { gql } from "@apollo/client";

export const APPOINTMENTS = gql`
  query Query {
    getAllCoordinatorScheduleFancy {
      _id
      info {
        datetime
        coordinator {
          _id
          coordinatorFName
          coordinatorLName
        }
        room
        group {
          _id
          coordinatorId
          groupName
          groupNumber
          projectField
        }
        attending {
          _id
          fullName
        }
      }
    }
  }
`;
