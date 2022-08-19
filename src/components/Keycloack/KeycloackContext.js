import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

// KEYCLOACK
import Keycloak from 'keycloak-js'

const KeycloackContext = createContext()

const KeycloackContextProvider = (props) => {
    const [keycloackValue, setKeycloackValue] = useState(null)
    const [authenticated, setAuthenticated] = useState(false)
    const [userInfo,setUserInfo] = useState(null)

    const setKeycloack = () => {
        const keycloak = Keycloak("/keycloak.json")

        keycloak.init({
            onLoad: 'login-required',
        }).then( async authenticated => {
            setKeycloackValue(keycloak)
            setAuthenticated(authenticated)

            if (authenticated) {
                localStorage.setItem("accessToken", keycloak.token);

                const accessToken = keycloak.token;
               

                const res = await axios.get(
                    `${process.env.REACT_APP_HELIX_SERVER_URL}/user/info`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setUserInfo(res?.data)

            }

        })
    }

    const logout = () => {
        setKeycloack(null)
        setAuthenticated(false)
        localStorage.clear();
        keycloackValue.logout()
    }

    useEffect(() => {
        setKeycloack()
    }, [])

    return (
        <KeycloackContext.Provider
            value={{
                keycloackValue,
                authenticated,
                userInfo,
                logout
            }}
        >
            {props['children']}
        </KeycloackContext.Provider>
    )
}

export { KeycloackContextProvider, KeycloackContext }