import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../../../App";

function Home() {

    const authContext = useContext(AuthContext);


    if (authContext.isLoggedIn) {
        if (authContext.user.role === "dosen") {
            return (
                <Redirect
                    to={{
                        pathname: "/jadwal",
                    }}
                />
            );
        } else {
            return (
                <Redirect
                    to={{
                        pathname: "/jadwalsesi",
                    }}
                />
            );
        }
    }

    return <div>Halaman Home</div>;
}

export default Home;
