import React, {useState, useEffect} from 'react';
import axios from 'axios';

const API_URL = "http://localhost:5005";

const AuthContext = React.createContext();

function AuthProviderWrapper(props){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    
    /* Store the token in the local storage */
    const storeToken = (token) =>{
        localStorage.setItem('authToken', token);
    }

    /* Authenticate the User via JWT */
    const authenticateUser = () =>{
        // Get the stored token from the local storage
        const storedToken = localStorage.getItem('authToken');

        if(storedToken){
            axios.get(`${API_URL}/auth/verify`, {headers: {Authorization: `Bearer ${storedToken}`}})
            .then((response)=>{
                const user = response.data; 
                setIsLoggedIn(true);
                setIsLoading(false);
                setUser(user);
            })
            .catch(()=>{
                setIsLoggedIn(false);
                setIsLoading(true);
                setUser(null);
            })
        }
        else {
            setIsLoggedIn(false);
            setIsLoading(true);
            setUser(null);
        }
    }

    const removeToken = () =>{
        localStorage.removeItem('authToken');
    }

    const logOut = () =>{
        removeToken();
        authenticateUser();
    }

    useEffect(()=>{
        authenticateUser();
    }, []);

    return(
        <AuthContext.Provider value={{isLoggedIn, isLoading, user, storeToken, authenticateUser, logOut}}>
            {props.children}
        </AuthContext.Provider>
    )   
}

export {AuthProviderWrapper, AuthContext};