import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../../App";

function PrivateRoute(props) {
    const authContext = useContext(AuthContext);
    return (
        <>
            {authContext.isLoggedIn() ? (
                <Route {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                    }}
                />
            )}
        </>
    );
}

export default PrivateRoute;
