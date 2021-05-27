import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavItem, NavLink, Nav, Row, Col } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";
import logoJti from "../../assets/images/logo_jti.png";

// import SubMenu from "./SubMenu";
import routes from "../../routes";
// import { faCopy, faImage, faPaperPlane, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../App";

const SideBar = ({ isOpen, toggle }) => {
    const authContext = useContext(AuthContext);

    return (
        <div className={classNames("sidebar", { "is-open": isOpen })}>
            <div className="sidebar-header">
                <span color="info" onClick={toggle} style={{ color: "#fff" }}>
                    &times;
            </span>
                {/* <h3>Bootstrap Sidebar</h3> */}
                <img src={logoJti} alt="logo jti" className="img-fluid p-3" />
            </div>
            <div className="side-menu">
                <Nav vertical className="list-unstyled py-3">
                    <p className="text-center">Automated Assessment MySQL</p>
                    {routes.map((route, index) =>
                        route.visible
                        && route.role === authContext.user.role
                        && <NavItem key={index}>
                            <NavLink tag={Link} to={route.path}>
                                <Row>
                                    <Col md="2">
                                        <FontAwesomeIcon
                                            icon={route.icon}
                                            className="mr-2"
                                        />
                                    </Col>
                                    <Col>
                                        {route.name}
                                    </Col>
                                </Row>
                            </NavLink>
                        </NavItem>
                    )}
                    {/* <NavItem>
                    <NavLink tag={Link} to={"/jadwalsesi"}>
                        <Row>
                            <Col md="2">
                                <FontAwesomeIcon
                                    icon={faCalendarAlt}
                                    className="mr-2"
                                />
                            </Col>
                            <Col>
                                Jadwal Sesi
                            </Col>
                        </Row>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to={"/nilaimhs"}>
                        <FontAwesomeIcon
                            icon={faChartBar}
                            className="mr-2"
                        />
                        Nilai
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to={"/studikasus"}>
                        <FontAwesomeIcon
                            icon={faDatabase}
                            className="mr-2"
                        />
                        Studi Kasus
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to={"/kelas"}>
                        <FontAwesomeIcon
                            icon={faChalkboard}
                            className="mr-2"
                        />
                        Kelas
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to={"/soal"}>
                        <FontAwesomeIcon
                            icon={faFileAlt}
                            className="mr-2"
                        />
                        Soal
                    </NavLink>
                </NavItem> */}
                    {/* <hr />
                    <SubMenu title="Pages" icon={faCopy} items={submenus[1]} />
                    <NavItem>
                        <NavLink tag={Link} to={"/pages"}>
                            <FontAwesomeIcon icon={faImage} className="mr-2" />
                        Portfolio
                    </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to={"/faq"}>
                            <FontAwesomeIcon icon={faQuestion} className="mr-2" />
                        FAQ
                    </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to={"/contact"}>
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                        Contact
                    </NavLink>
                    </NavItem> */}
                </Nav>
            </div>
        </div>
    )
};

// const submenus = [
//     [
//         {
//             title: "Home 1",
//             target: "Home-1",
//         },
//         {
//             title: "Home 2",
//             target: "Home-2",
//         },
//         {
//             title: "Home 3",
//             target: "Home-3",
//         },
//     ],
//     [
//         {
//             title: "Page 1",
//             target: "Page-1",
//         },
//         {
//             title: "Page 2",
//             target: "Page-2",
//         },
//     ],
// ];

export default SideBar;
