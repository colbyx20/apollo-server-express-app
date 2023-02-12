import { create } from "apisauce";

const headers = {
  "content-type": "json",
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

const apiClient = create({
  baseURL: "https://sea-turtle-app-msdsw.ondigitalocean.app/graphql",
  //method: "GET",
  headers: headers,
  data: graphqlQuery,
});

export default apiClient;
