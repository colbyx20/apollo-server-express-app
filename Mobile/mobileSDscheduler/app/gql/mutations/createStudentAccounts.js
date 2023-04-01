import { gql } from "@apollo/client";

export const GROUPS = gql`
  mutation Mutation(
    $cid: ID!
    $userLogin: String
    $password: String
    $firstname: String
    $groupNumber: Int
    $lastname: String
  ) {
    createStudentAccounts(
      CID: $cid
      userLogin: $userLogin
      password: $password
      firstname: $firstname
      groupNumber: $groupNumber
      lastname: $lastname
    )
  }
`;
