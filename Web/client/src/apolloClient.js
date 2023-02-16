import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';

const web_uri = "https://sea-turtle-app-msdsw.ondigitalocean.app/graphql"
const local_uri = "http://localhost:8080/graphql"


const httpLink = createHttpLink({
    uri: local_uri,
    cache: new InMemoryCache(),
    credentials:'same-origin'
});

// auth link 
const authLink = setContext((_,{headers}) => {
    return{
        headers:{
            ...headers,
            authorization:localStorage.getItem("token") || ""
        }
    }
});

const client = new ApolloClient({
    link:authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;