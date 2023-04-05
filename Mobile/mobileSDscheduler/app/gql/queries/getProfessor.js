import { gql } from "@apollo/client";

export const PROFESSOR = gql`
  query GetUser($getProfessorId2: ID!, $id: String!) {
    getProfessor(ID: $getProfessorId2) {
      professorFName
      professorLName
    }
    getUserInfo(ID: $id) {
      notificationEmail
      email
    }
  }
`;
