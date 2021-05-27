import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import {
    Navbar,
    Button,
    NavbarToggler,
    Collapse,
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";

const Topbar = ({ toggleSidebar }) => {
    const authContext = useContext(AuthContext);
    const [topbarIsOpen, setTopbarOpen] = useState(true);
    const toggleTopbar = () => setTopbarOpen(!topbarIsOpen);

    return (
        <Navbar
            color="light"
            light
            className="navbar shadow-sm p-3 mb-5 bg-white rounded"
            expand="md"
        >
            <Button color="white" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faAlignLeft} />
            </Button>
            <NavbarToggler onClick={toggleTopbar} />
            <Collapse isOpen={topbarIsOpen} navbar>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink
                            tag={Link}
                            to={"/profile"}
                            className="mt-1 text-dark"
                        >
                            {authContext.user.username}
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            tag={Button}
                            color="white"
                            onClick={authContext.logout}
                            className="mt-1"
                            size="sm"
                        >
                            Logout
                        </NavLink>
                        {/* <NavLink tag={Link} to={"/page-4"}>
                            page 4
                        </NavLink> */}
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    );
};

export default Topbar;
