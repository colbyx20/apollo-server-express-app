import { gql } from "@apollo/client";

// Variables:
// {
//   "registerInput": {
//     "confirmpassword": null,
//     "email": null,
//     "firstname": null,
//     "lastname": null,
//     "password": null
//   }
// }
export const GROUPS = gql`
  mutation Mutation($registerInput: RegisterInput) {
    registerCoordinator(registerInput: $registerInput) {
      _id
      confirm
      email
      lastname
      firstname
      notificationEmail
      password
      privilege
      token
    }
  }
`;
