import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Alert, Button, Col, Container, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap';
import DataTable from '../../../components/datatable';
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../config';
import Spinner from '../../../components/spinner'
import download from 'downloadjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const INITIAL_STATE = {
    name: "",
    semester: 1
}

function Kelas() {
    const [isFormShown, setIsFormShown] = useState(false)
    const [classForm, setClassForm] = useState(INITIAL_STATE)
    const [errorCreate, setErrorCreate] = useState({
        isVisible: false,
        message: ""
    })

    const [errorName, setErrorName] = useState({
        isVisible: false,
        message: ""
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getClasses()
            .then(() => setLoading(false))
    }, [])

    const getClasses = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/classes`, {
                headers: { ...BEARER_TOKEN }
            })
                .then(({ data }) => {
                    setDatatable({
                        ...datatable,
                        rows: data.data.map(val => {
                            return {
                                name: val.name,
                                action: <Link to={`/kelas/${val.id}`}>
                                    <Button outline size="sm">Lihat Detail</Button>
                                </Link>
                            }
                        })
                    })
                    resolve(true)
                })
                .catch(err => reject(err))
        })
    }

    const downloadExcel = (name) => {
        if (!name) {
            return
        }
        if (!checkClassName(classForm.name)) {
            setErrorName({
                ...errorName,
                isVisible: true
            })
            return
        }
        axios.get(`${ENDPOINT_BACKEND}/classes/excel/${name}`, {
            headers: { ...BEARER_TOKEN },
            responseType: 'blob'
        })
            .then(res => {
                const content = res.headers['content-type'];
                download(res.data, name, content)
            })
            .catch((err) => console.log(err))
    }

    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "Kelas",
                field: "name",
                width: 300,
                attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "Kelas",
                },
            },
            {
                label: "",
                field: "action",
                width: 100,
            },
        ],
        rows: [
            {
                name: "TI-4A-2020",
                action: <Link to="/kelas/1">
                    <Button>Lihat Detail</Button>
                </Link>
            },
            {
                name: "MI-3C-2020",
                action: <Link to="/kelas/2">
                    <Button>Lihat Detail</Button>
                </Link>
            },
        ],
    });

    const submitForm = (e) => {
        e.preventDefault()
        if (!checkClassName(classForm.name)) {
            return
        }
        const data = new FormData()
        Object.keys(classForm).forEach(key => {
            data.append(key, classForm[key])
        })
        axios.post(`${ENDPOINT_BACKEND}/classes/upload`, data, { headers: { ...BEARER_TOKEN } })
            .then(res => {
                if (!res.data.success) {
                    setErrorCreate({
                        isVisible: true,
                        message: res.data.message
                    })
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                setClassForm(INITIAL_STATE)
                setIsFormShown(false)
                setLoading(true)
                getClasses()
                    .then(() => setLoading(false))
                    .catch(err => console.log(err))
            })
    }

    const checkClassName = (name) => {
        const names = name.split("-")
        if (names.length !== 3) {
            setErrorName({
                isVisible: true,
                message: "Pastikan format nama kelas benar"
            })
            return false
        }

        if (!(names[0] === "TI" || names[0] === "MI")) {
            setErrorName({
                isVisible: true,
                message: "Prodi harus TI atau MI"
            })
            return false
        }

        return true
    }

    return (
        <Container>
            <h4 className="mb-4">Daftar Kelas</h4>
            <div className="text-right">
                <Button color="info" outline onClick={e => setIsFormShown(!isFormShown)} className="mb-4">Tambah Kelas</Button>
            </div>
            {isFormShown && (<div className="mt-4">
                <Form onSubmit={submitForm}>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="name">Nama Kelas</Label>
                                <Input type="text" id="name" name="name" placeholder="TI-1A-2021..." value={classForm.name} onChange={e => setClassForm({ ...classForm, [e.target.name]: e.target.value })} />
                                <FormText color="muted">
                                    <span className="text-danger" hidden={!errorName.isVisible}>{errorName.message}
                                        <br />
                                    </span>
                                    Nama kelas diisi dengan format [Prodi]-[Kelas]-[Tahun]
                                    <br />
                                    Contoh: TI-1A-2021
                                </FormText>
                            </FormGroup>
                            <FormGroup>
                                <Label>Template File Excel Kelas: {(classForm.name) ? classForm.name : <span className="text-muted">Isikan nama kelas</span>}</Label>
                                <br />
                                <Button color="success" onClick={e => downloadExcel(classForm.name)}> <FontAwesomeIcon icon={faDownload} className="mr-2" /> Download</Button>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="semester">Semester</Label>
                                <Input type="number" id="semester" name="semester" className="w-25" placeholder="Semester" value={classForm.semester} onChange={e => setClassForm({ ...classForm, [e.target.name]: e.target.value })} min="1" max="8" />
                            </FormGroup>
                            <FormGroup className="mt-5">
                                <Label for="excel">File Excel</Label>
                                <Input type="file" name="excel" id="excel" onChange={e => setClassForm({ ...classForm, [e.target.name]: e.target.files[0] })} required />
                                <FormText color="muted">
                                    File Excel list mahasiswa
                                </FormText>
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="text-right">
                        <Button type="submit" className="purple-button">Simpan</Button>
                    </div>
                </Form>
            </div>)
            }
            { loading ? <Spinner /> : <div>
                <Alert color="light" isOpen={errorCreate.isVisible} className="border-danger text-danger mt-3">
                    {errorCreate.message}
                </Alert>
                <DataTable datatable={datatable} />
            </div>}
        </Container >
    )
}

export default Kelas
