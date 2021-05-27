import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import { createContext, useEffect, useState } from "react";

import PrivateRoute from "./components/privateRoute";
import Login from "./pages/login";
import Dashboard from "./components/dashboard";
import SoalSesiTest from "./pages/mahasiswa/soalsesi/SoalSesiTest";
import SoalShowTest from "./pages/mahasiswa/soalshow/SoalShowTest";

export const AuthContext = createContext();

function App() {
    const [token, setToken] = useState(localStorage.getItem("authToken") || "");
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || "")

    const logout = () => {
        setToken("")
        localStorage.removeItem("authToken");

        setUser("")
        localStorage.removeItem("user");
    }

    const isLoggedIn = () => token !== ""

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, setToken, user, setUser, logout }}>
            <Router>
                <div className="App wrapper">
                    <Switch>
                        <Route path="/login" exact component={Login} />
                        <Route path="/test" exact component={SoalSesiTest} />
                        <Route path="/soaltest/:id" exact component={SoalShowTest} />
                        <PrivateRoute path="/" component={Dashboard} />
                    </Switch>
                </div>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
