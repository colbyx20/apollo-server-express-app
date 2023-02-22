import { create } from "apisauce";

const headers = {
  //"content-type": "json",
  //"apollo-require-preflight": true,
  //"content-type": "application/json",
  //Authorization: "<token>",
};
const graphqlQuery = {
  operationName: "getAllGroups",
  query: `query getAllGroups {
    groupName
    _id
  } }`,
  variables: {},
};

const local_uri = "http://localhost:8080/graphql"
const web_uri = "https://sea-turtle-app-msdsw.ondigitalocean.app/graphql"
const apiClient = create({
  baseURL: local_uri,
  //method: "GET",
  headers: headers,
  data: graphqlQuery,
});

export default apiClient;
