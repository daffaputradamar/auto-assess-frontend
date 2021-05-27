import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Button, Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap'
import ButtonKembali from '../../../components/buttonkembali'
import Spinner from '../../../components/spinner'
import { BEARER_TOKEN, ENDPOINT_ASSETS, ENDPOINT_BACKEND } from '../../../config'
import TableSample from '../../mahasiswa/soalshow/TableSample'

function SoalDetail(props) {
    const [loading, setLoading] = useState(true)
    const [question, setQuestion] = useState(null)

    const { id } = useParams()

    useEffect(() => {
        setLoading(true)
        getQuestion(id)
            .then(() => {
                setLoading(false)
            })
    }, [])

    const getQuestion = (id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/questions/${id}`, {
                headers: { ...BEARER_TOKEN }
            })
                .then(({ data }) => {
                    setQuestion(data.data)
                    resolve(true)
                })
                .catch(err => reject(err))
        })
    }

    return (
        <Container>
            <div className="mb-4">
                <ButtonKembali history={props.history} />
            </div>
            <div className="text-right">
                <Button outline color="danger">
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                    />
                </Button>
            </div>
            {loading ? <Spinner /> : <Row>
                <Col>
                    <p>Teks Soal:</p>
                    <h5 className="mb-5"><span dangerouslySetInnerHTML={{ __html: question.text }}></span></h5>
                    <p>Query Kunci:</p>
                    <h5 className="mb-5">{question.answer}</h5>
                    <p>Gambar:</p>
                    <img src={`${ENDPOINT_ASSETS}/${question.answer_pic}`} alt="gambar screenshot jawaban" className="mb-5" />
                </Col>
                <Col className="border-left">
                    <p>Studi Kasus:</p>
                    <h5 className="mb-5">{question.CaseStudy.name}</h5>
                    <p>Tabel yang digunakan</p>
                    <ListGroup>
                        <TableSample tables={question.tables} />
                    </ListGroup>
                </Col>
            </Row>}
        </Container>
    )
}

export default SoalDetail
