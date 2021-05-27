import React, { useState } from "react";
import SideBar from "../sidebar";
import Content from "../content";

function Dashboard() {
    const [sidebarIsOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

    return (
        <>
            <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
            <Content
                toggleSidebar={toggleSidebar}
                sidebarIsOpen={sidebarIsOpen}
            />
        </>
    );
}

export default Dashboard;
