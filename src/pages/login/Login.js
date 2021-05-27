import React, { useContext, useState } from "react";
import {
    Alert,
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../App";
import axios from "axios";
import { ENDPOINT_BACKEND } from "../../config";

const INITIAL_STATE = {
    username: "",
    password: "",
};

function Login(props) {
    const authContext = useContext(AuthContext);

    const [loginForm, setLoginForm] = useState(INITIAL_STATE);

    const [isSuccess, setIsSuccess] = useState(true)
    const [errMessage, setErrMessage] = useState("")

    const [loginAs, setLoginAs] = useState("dosen")

    const redirectIfAuthenticated = (isLoggedIn) => {
        if (isLoggedIn) {
            (authContext.user.role === "dosen") ? props.history.push('/jadwal') : props.history.push('/jadwalsesi')
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const endpoint = (loginAs == "dosen") ? "users" : "students"
        axios.post(`${ENDPOINT_BACKEND}/${endpoint}/login`, {
            ...loginForm
        }).then(res => {
            if (!res.data.success) {
                setIsSuccess(res.data.success)
                setErrMessage(res.data.message)
            } else {
                localStorage.setItem("user", JSON.stringify(res.data.data.user))
                localStorage.setItem("authToken", res.data.data.token)

                authContext.setUser(res.data.data.user)
                authContext.setToken(res.data.data.token)

                window.location.reload();
                // if (res.data.data.user.role == "dosen") {
                //     props.history.push('/jadwal')
                // } else {
                //     props.history.push('/jadwalsesi')
                // }
            }

        })

        setLoginForm(INITIAL_STATE);
    };

    return (
        <Container>
            {
                redirectIfAuthenticated(authContext.isLoggedIn())
            }
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <Card className="w-50">
                    <CardBody>
                        <div className="my-3">
                            <h1 className="text-center mb-3">
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="mr-2"
                                    color="#244282"
                                />
                            </h1>

                            <h6 className="text-center mb-3">
                                Login Sebagai:
                        </h6>
                            <Row>
                                <Col className="text-right border-right">
                                    <Button block outline={loginAs !== "dosen"} color="info" onClick={e => setLoginAs("dosen")}>Dosen</Button>
                                </Col>
                                <Col className="text-left border-left">
                                    <Button block outline={loginAs !== "mahasiswa"} color="secondary" onClick={e => setLoginAs("mahasiswa")}>Mahasiswa</Button>
                                </Col>
                            </Row>
                        </div>
                        {!isSuccess && <Alert color="danger">
                            {errMessage}
                        </Alert>}
                        <Form onSubmit={onSubmit}>
                            <Col>
                                <FormGroup>
                                    <Label for="username">Username</Label>
                                    <Input
                                        required
                                        type="text"
                                        name="username"
                                        id="username"
                                        placeholder="Username"
                                        value={loginForm.username}
                                        onChange={(e) =>
                                            setLoginForm({
                                                ...loginForm,
                                                username: e.target.value,
                                            })
                                        }
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input
                                        required
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="********"
                                        value={loginForm.password}
                                        onChange={(e) =>
                                            setLoginForm({
                                                ...loginForm,
                                                password: e.target.value,
                                            })
                                        }
                                    />
                                </FormGroup>
                            </Col>
                            <div className="text-center mt-4">
                                <Button size="lg" className="purple-button">
                                    Login
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </Container>
    );
}

export default Login;
