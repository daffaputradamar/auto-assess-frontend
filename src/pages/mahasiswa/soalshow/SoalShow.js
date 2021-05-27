import React, { useEffect, useState } from 'react'
import { Col, Container, Input, Row, Toast, ToastBody, ToastHeader, Button } from 'reactstrap'
import ButtonKembali from '../../../components/buttonkembali'
import TableSample from './TableSample'
import { useParams } from 'react-router'
import axios from 'axios'
import { ENDPOINT_BACKEND, ENDPOINT_ASSETS, BEARER_TOKEN } from '../../../config'
import Spinner from '../../../components/spinner'
import DynamicTable from '../../../components/dynamictable'

function SoalShow(props) {
    const { id } = useParams()
    const { state: { session } } = props.location

    const [loading, setLoading] = useState(true)
    const [question, setQuestion] = useState()
    const [showToast, setShowToast] = useState(false);
    const [queryStatus, setQueryStatus] = useState({
        similarity: -1,
        success: false,
        message: "Pesan Placeholder",
    })
    const [resultQuery, setResultQuery] = useState(null)

    const [answer, setAnswer] = useState("")

    const toggleToast = () => setShowToast(!showToast);

    useEffect(() => {
        setLoading(true)
        axios.get(`${ENDPOINT_BACKEND}/questions/${id}`, { headers: { ...BEARER_TOKEN } })
            .then(({ data }) => {
                setQuestion(data.data)
                setLoading(false)
            })
            .catch(err => console.log(err))
    }, [])

    const testAnswer = () => {
        axios.post(`${ENDPOINT_BACKEND}/sessions/${session}/answer/${id}`, {
            answer,
            type: "test"
        }, {
            headers: { ...BEARER_TOKEN }
        })
            .then(({ data }) => {
                setQueryStatus(data.data)
                setShowToast(true)
                if (data.data.success) {
                    setResultQuery(data.data.resQuery)
                }
            })
            .catch(err => console.log(err))
    }

    const submitAnswer = () => {
        axios.post(`${ENDPOINT_BACKEND}/sessions/${session}/answer/${id}`, {
            answer,
            type: "submit"
        }, {
            headers: { ...BEARER_TOKEN }
        })
            .then(({ data }) => {
                props.history.push(`/soalsesi/${session}`)
            })
            .catch(err => console.log(err))
    }

    return (
        <Container>
            <div className="mb-4">
                <ButtonKembali history={props.history} />
            </div>
            {loading ? <Spinner /> : <div>
                <span dangerouslySetInnerHTML={{ __html: question.text }}></span>
                <Row className="mt-4">
                    <Col sm="12" md="6">
                        <Input type="textarea" name="text" rows="4" value={answer} onChange={e => setAnswer(e.target.value)} />
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <Button outline onClick={testAnswer}>
                                Test Query
                            </Button>
                            <Button className="purple-button" onClick={submitAnswer}>
                                Submit Query
                                </Button>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                            <Toast isOpen={showToast} className={`mt-5 w-100`} style={{ flexBasis: "100%" }}>
                                <ToastHeader toggle={toggleToast} className={`${(queryStatus.success) ? 'text-success' : 'text-danger'}`}>Query {(queryStatus.success) ? "Sukses" : "Error"}</ToastHeader>
                                <ToastBody>
                                    {(!queryStatus.success) ? <span>
                                        Prosentase Kemiripan: {queryStatus.similarity.toFixed(2)}
                                        <br />
                                        <br />
                                        <h6 className="text-lg">
                                            {queryStatus.message}
                                        </h6>
                                    </span> : <h6>{queryStatus.message}</h6>}
                                </ToastBody>
                            </Toast>
                        </div>
                        {resultQuery && queryStatus.success && <div className="mt-4">
                            <DynamicTable data={resultQuery} name="Hasil Result" />
                        </div>}
                    </Col>
                    <Col className="border-left ml-3">
                        <div>
                            <h6>Contoh Hasil Query:</h6>
                            <img src={`${ENDPOINT_ASSETS}/${question.answer_pic}`} alt="hasil query" className="img-fluid" />
                        </div>
                        <div className="mt-4">
                            <h6 className="mb-3">Tabel yang digunakan:</h6>
                            <TableSample tables={question.tables} />
                        </div>
                    </Col>
                </Row>
            </div>}
        </Container>
    )
}

export default SoalShow
