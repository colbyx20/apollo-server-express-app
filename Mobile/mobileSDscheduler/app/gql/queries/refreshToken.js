import { gql } from "@apollo/client";

export const GROUPS = gql`
  query Query($refreshTokenId: String, $privilege: String) {
    refreshToken(id: $refreshTokenId, privilege: $privilege)
  }
`;
