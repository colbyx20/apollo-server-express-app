import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';

const web_uri = "https://sea-turtle-app-msdsw.ondigitalocean.app/graphql"
const local_uri = "http://localhost:8080/graphql"


const httpLink = createHttpLink({
    uri: "http://localhost:8080/graphql",
    cache: new InMemoryCache(),
    credentials:'include',
});

// auth link 
const authLink = setContext((_,{headers}) => {
    const token = localStorage.getItem('token');
    return{
        headers:{
            ...headers,
            authorization:token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link:authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;