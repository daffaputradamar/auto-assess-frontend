import React, { useContext } from "react";
import { Container, Table } from "reactstrap";
import { AuthContext } from "../../App";

function Profile() {
    const authContext = useContext(AuthContext);

    return (
        <Container>
            <h4 className="text-muted">Personal Information</h4>
            <hr />
            <div className="mt-4">
                <Table borderless>
                    <tbody>
                        <tr>
                            <td>
                                <h6 className="m-0">Nama</h6>
                            </td>
                            <td>
                                <p className="m-0">: {authContext.user.name}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h6 className="m-0">Username</h6>
                            </td>
                            <td>
                                <p className="m-0">
                                    : {authContext.user.username}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h6 className="m-0">NIM</h6>
                            </td>
                            <td>
                                <p className="m-0">: {authContext.user.role == "dosen" ? authContext.user.no_induk : authContext.user.nim}</p>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </Container>
    );
}

export default Profile;
