import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import DataTable from '../../../components/datatable';
import Spinner from '../../../components/spinner/Spinner';
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../config';


const INITIAL_STATE = {
    description: "",
    type: ""
}

function SoalPaket() {
    const [isFormShown, setIsFormShown] = useState(false)
    const [containerForm, setContainerForm] = useState(INITIAL_STATE)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getContainers()
            .then(() => {
                setLoading(false)
            })
    }, [])

    const getContainers = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/containers/`, { headers: { ...BEARER_TOKEN } })
                .then(({ data }) => {
                    setDatatable({
                        ...datatable,
                        rows: data.data.map(container => {
                            return {
                                description: container.description,
                                sum: container.questionCount,
                                created_by: container.User.name,
                                action: <Link to={`/paketsoal/${container.id}`}>
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

    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "Deskripsi",
                field: "description",
                width: 300,
                attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "Deskripsi",
                },
            },
            {
                label: "Jumlah Soal",
                field: "sum",
                width: 200,
            },
            {
                label: "Dibuat Oleh",
                field: "created_by",
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
                description: "Latihan 1",
                type: "latihan",
                sum: 10,
                action: <Link to="/paketsoal/1">
                    <Button>Lihat Detail</Button>
                </Link>
            },
            {
                description: "Kuis 1",
                type: "Kuis",
                sum: 10,
                action: <Link to="/paketsoal/2">
                    <Button>Lihat Detail</Button>
                </Link>
            }
        ],
    });

    const submitForm = (e) => {
        e.preventDefault()
        axios.post(`${ENDPOINT_BACKEND}/containers`, { ...containerForm }, { headers: { ...BEARER_TOKEN } })
            .then(() => {
                setLoading(true)
                getContainers()
                    .then(() => {
                        setLoading(false)
                        setContainerForm(INITIAL_STATE)
                        setIsFormShown(false)
                    })
            })
            .catch(err => console.log(err))
    }

    return (
        <Container>
            <h4 className="mb-4">Paket Soal</h4>
            <div className="text-right">
                <Button color="info" outline onClick={e => setIsFormShown(!isFormShown)} className="mb-4">Tambah Paket</Button>
            </div>
            {isFormShown && (<div className="mt-4 mb-5">
                <Form onSubmit={submitForm}>
                    <Row form>
                        <Col md={6}>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="description">Deskripsi Paket Soal</Label>
                                <Input type="text" id="description" name="description" placeholder="Kuis 1, Latihan 1..." value={containerForm.description} onChange={e => setContainerForm({ ...containerForm, [e.target.name]: e.target.value })} />
                            </FormGroup>
                            <div className="text-right">
                                <Button type="submit" className="purple-button">Simpan</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>)}
            {loading ? <Spinner /> : <DataTable datatable={datatable} />}
        </Container>
    );
}

export default SoalPaket
