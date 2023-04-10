import { gql } from "@apollo/client";

// Variables:
// {
//   "loginInput": {
//     "email": null,
//     "password": null
//   }
// }
export const GROUPS = gql`
  mutation Mutation($loginInput: loginInput) {
    loginUser(loginInput: $loginInput) {
      _id
      confirm
      email
      firstname
      image
      lastname
      password
      privilege
      token
    }
  }
`;
