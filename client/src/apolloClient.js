import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
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