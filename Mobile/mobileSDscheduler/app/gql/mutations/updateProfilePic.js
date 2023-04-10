import { gql } from "@apollo/client";

// Variables:
// {
//   "id": null,
//   "ppUrl": null
// }
export const GROUPS = gql`
  mutation Mutation($id: ID!, $ppUrl: String!) {
    updateProfilePic(ID: $id, ppURL: $ppUrl)
  }
`;
