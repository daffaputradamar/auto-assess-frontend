import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, FormText, Input, Label, Row, Spinner } from 'reactstrap';
import DataTable from '../../../components/datatable';
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../config';

const INITIAL_STATE = {
    name: "",
    sql: null
}

function StudiKasus() {
    const [isFormShown, setIsFormShown] = useState(false)
    const [studyCaseForm, setStudyCaseForm] = useState(INITIAL_STATE)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getCaseStudies()
            .then(() => {
                setLoading(false)
            })
    }, [])

    const getCaseStudies = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/casestudies`, {
                headers: { ...BEARER_TOKEN }
            })
                .then(({ data }) => {
                    setDatatable({
                        ...datatable,
                        rows: data.data.map(val => {
                            return {
                                name: val.name,
                                user: val.User.name,
                                action: <Link to={`/studikasus/${val.id}`}>
                                    <Button color="secondary" outline size="sm">Lihat Detail</Button>
                                </Link>
                            }
                        })
                    })
                    resolve(true)
                })
                .catch(err => reject(err))
        })
    }

    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "Nama",
                field: "name",
                width: 300,
                attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "Kelas",
                },
            },
            {
                label: "Dibuat Oleh",
                field: "user",
                width: 300,
            },
            {
                label: "",
                field: "action",
                width: 100,
            },
        ],
        rows: [
            {
                name: "Perkuliahan",
                user: "nama dosen",
                action: <Link to="/studikasus/1">
                    <Button>Lihat Detail</Button>
                </Link>
            },
            {
                name: "Rumah Sakit",
                user: "nama dosen",
                action: <Link to="/studikasus/2">
                    <Button>Lihat Detail</Button>
                </Link>
            },
        ],
    });

    const submitForm = (e) => {
        e.preventDefault()
        const data = new FormData()
        Object.keys(studyCaseForm).forEach(key => {
            data.append(key, studyCaseForm[key])
        })
        axios.post(`${ENDPOINT_BACKEND}/casestudies/upload`, data, {
            headers: { ...BEARER_TOKEN }
        })
            .then(res => {
                console.log(res.statusText)
            })
            .catch(err => console.log(err))
            .finally(() => {
                setStudyCaseForm(INITIAL_STATE)
                setIsFormShown(false)
                setLoading(true)
                getCaseStudies()
                    .then(() => setLoading(false))
                    .catch(err => console.log(err))
            })
    }

    return (
        <Container>
            <h4 className="mb-4">Studi Kasus</h4>
            <div className="text-right">
                <Button color="info" outline onClick={e => setIsFormShown(!isFormShown)} className="mb-4">Tambah Studi Kasus</Button>
            </div>
            {isFormShown && (<div className="mt-4">
                <Form onSubmit={submitForm}>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="name">Nama Studi Kasus</Label>
                                <Input type="text" id="name" name="name" placeholder="Kelurahan, Rumah Sakit, ..." value={studyCaseForm.name} onChange={e => setStudyCaseForm({ ...studyCaseForm, [e.target.name]: e.target.value })} required />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="sql">File SQL</Label>
                                <Input type="file" name="sql" id="sql" onChange={e => setStudyCaseForm({ ...studyCaseForm, [e.target.name]: e.target.files[0] })} required />
                                <FormText color="muted">
                                    File SQL hasil backup
                        </FormText>
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="text-right">
                        <Button type="submit" className="purple-button">Simpan</Button>
                    </div>
                </Form>
            </div>)}
            {
                loading ? <Spinner /> : <DataTable datatable={datatable} />
            }
        </Container>
    );
}

export default StudiKasus
