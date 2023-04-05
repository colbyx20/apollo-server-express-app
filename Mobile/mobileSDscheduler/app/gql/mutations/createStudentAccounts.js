import { gql } from "@apollo/client";

// Variables:
// {
//   "cid": null,
//   "userLogin": null,
//   "password": null,
//   "firstname": null,
//   "groupNumber": null,
//   "lastname": null
// }
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
