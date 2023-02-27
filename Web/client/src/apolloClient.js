import {ApolloClient,ApolloLink, createHttpLink, InMemoryCache,from } from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import jwtDecode from 'jwt-decode';
// import axios from "axios"

const web_uri = "https://sea-turtle-app-msdsw.ondigitalocean.app/graphql"
const local_uri = "http://localhost:8080/graphql"

const httpLink = createHttpLink({
    uri: "http://localhost:8080/graphql",
    credentials:'include',
    cache: new InMemoryCache(),
});


// auth link 
// const authLink = setContext((_,{headers}) => {
//     const token = localStorage.getItem('token');
//     return{
//         headers:{
//             ...headers,
//             authorization:token ? `Bearer ${token}` : "",
//         }
//     }
// });

const authLink = new ApolloLink((operation, forward) => {

  console.log(operation.getContext());

  const accessToken = localStorage.getItem("token");

  // const decodedToken = jwtDecode(accessToken)

  // if(decodedToken.exp * 1000 < Date.now()){
  //   // getRefreshToken();
  // }


  operation.setContext(({ headers = {}}) => ({
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  }));

  return forward(operation);
});

const refreshLink = new ApolloLink((operation, forward) => {

  // console.log(operation.getContext());
  const prevHeader = operation.getContext().headers.authorization;
  // console.log(prevHeader);

  const accessToken = prevHeader.split('Bearer')[1];
  console.log(accessToken);

  const accessTokenLocal = localStorage.getItem("token");
  if(accessTokenLocal ){
    const decodedToken = jwtDecode(accessToken)
    console.log(decodedToken);
    getRefreshToken(decodedToken.id,decodedToken.privilege, decodedToken);
    if(decodedToken.exp * 1000 < Date.now()){
    }
  }



  // operation.setContext(({ headers = {}}) => ({
  //   headers: {
  //     ...headers,
  //     authorization: accessToken ? `Bearer ${accessToken}` : "",
  //   },
  // }));

  return forward(operation);
});



 const getRefreshToken = async (ID,privilege,token) =>{
  console.log('INFO');
  console.log(ID);
  console.log(privilege);
  console.log(token);
    // "query":`query Query{refreshToken}`,

    const query2 = `query Query {
      refreshToken2
    }`

    const query = `query Query($privilege: String, $id: ID!, $token: String) {
        refreshToken(privilege: $privilege, ID: $id, token: $token)
      }
    }`

    const graphqlQuery = {
      "operationName": "Query",
      "query":query,
      "variables":{privilege,ID,token}
    }


    const refreshToken = await fetch("http://localhost:8080/graphql",{
      method:"POST",
      headers:{"Content-Type":"application/json",},
      body: JSON.stringify(graphqlQuery),
    })

    const res = await refreshToken.json();
    console.log(res);

    // if(!localStorage.getItem("token")){
    //   return;
    // }else{
    //   localStorage.setItem("SomethingHere", res.data.refreshToken2);
    //   console.log(res.data.refreshToken2);

    // }
  
 }



const client = new ApolloClient({
    // link:authLink.concat(httpLink),
    link:from([authLink,refreshLink,httpLink]),
    cache: new InMemoryCache()
});

export default client;