import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Button, Container } from 'reactstrap'
import ButtonKembali from '../../../../components/buttonkembali'
import DataTable from '../../../../components/datatable';
import Spinner from '../../../../components/spinner';
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../../config';

function TabelSample(props) {

    const [loading, setloading] = useState(true)
    const [caseStudy, setCaseStudy] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        setloading(true)
        getCaseStudy(id)
            .then(() => {
                setloading(false)
            })
    }, [])

    const getCaseStudy = (id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/casestudies/${id}`, {
                headers: { ...BEARER_TOKEN }
            })
                .then(({ data }) => {
                    setCaseStudy(data.data)
                    const tables = data.data.tables
                    setDatatable({
                        ...datatable,
                        rows: Object.keys(tables).map(key => {
                            return {
                                name: key,
                                columns: tables[key].reduce((acc, curr) => {
                                    if (tables[key].indexOf(curr) === tables[key].length - 1) {
                                        acc += curr + ""
                                        return acc
                                    }
                                    acc += curr + " | "
                                    return acc
                                }, ""),
                                action: <Link to={`/studikasus/${id}/data/${key}`}>
                                    <Button size="sm" outline>Lihat Data</Button>
                                </Link>
                            }
                        })
                    })
                    resolve(true)
                })
                .catch(err => reject(err))
        })
    }

    const deleteStudyCase = (id) => {
        axios.delete(`${ENDPOINT_BACKEND}/casestudies/${id}`, {
            headers: { ...BEARER_TOKEN }
        })
            .then(() => {
                props.history.push('/studikasus')
            })
            .catch(err => console.log(err))
    }

    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "Nama Tabel",
                field: "name",
                width: 200,
                attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "Nama Tabel",
                },
            },
            {
                label: "Kolom",
                field: "columns",
                width: 500,
            },
            {
                label: "",
                field: "action",
                width: 100,
            },
        ],
        rows: [
            {
                name: "user",
                columns: "id | username | password",
                action: <Link to="/studikasus/1/data/2">
                    <Button>Lihat Data</Button>
                </Link>
            },
            {
                name: "category",
                columns: "id | name",
                action: <Link to="/studikasus/1/data/2">
                    <Button>Lihat Data</Button>
                </Link>
            },
        ],
    });

    return (
        <Container>
            <div className="mb-4">
                <ButtonKembali history={props.history} />
            </div>
            {loading ? <Spinner /> : <div>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="mb-4">
                        <h4 className="mb-4">{caseStudy.name}</h4>
                        <div className="text-muted d-flex align-items-center">
                            <h6 className="mr-2"> <b>Nama Database:</b> </h6> <h6>{caseStudy.db_name}</h6>
                        </div>
                    </div>
                    <Button outline color="danger" onClick={e => deleteStudyCase(id)}>
                        <FontAwesomeIcon
                            icon={faTrashAlt}
                        />
                    </Button>
                </div>
                <DataTable datatable={datatable} />
            </div>
            }
        </Container>
    )
}

export default TabelSample
