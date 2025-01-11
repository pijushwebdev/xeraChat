import { useSelector } from "react-redux"


export default function useAuth() {
    //like context api
    const auth = useSelector(state => state.auth);

    if(auth?.accessToken && auth?.user){
        return auth.user;
    }
}
