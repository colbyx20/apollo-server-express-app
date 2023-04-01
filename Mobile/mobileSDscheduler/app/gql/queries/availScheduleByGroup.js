import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query($date: DateTime!) {
    availScheduleByGroup(date: $date)
  }
`;
