import React from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "../privateRoute";

import Topbar from "./Topbar";
import routes from "../../routes";

const Content = ({ sidebarIsOpen, toggleSidebar }) => {
    function renderRoutes() {
        return routes.map((route, index) => (
            <PrivateRoute
                path={route.path}
                component={route.component}
                key={index}
                exact
            />
        ));
    }

    return (
        <Container
            fluid
            className={classNames("content", { "is-open": sidebarIsOpen })}
        >
            <Topbar toggleSidebar={toggleSidebar} />
            <Switch>
                {/* <Route exact path="/" component={() => "Hello"} /> */}
                {renderRoutes()}
            </Switch>
        </Container>
    );
};

export default Content;
