import {gql, useQuery} from '@apollo/client';

const CHECK_AUTH = gql`
    query RefreshToken($id: ID!, $token: String, $privilege: String) {
    refreshToken(ID: $id, token: $token, privilege: $privilege) {
        token
    }
}
`

export const Refresh = (token) =>{

     const{loading,error,data} = useQuery(CHECK_AUTH);
    






}