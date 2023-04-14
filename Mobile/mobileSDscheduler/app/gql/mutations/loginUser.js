import { gql } from "@apollo/client";

// Variables:
// {
//   "loginInput": {
//     "email": null,
//     "password": null
//   }
// }
export const LOGIN_USER = gql`
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
