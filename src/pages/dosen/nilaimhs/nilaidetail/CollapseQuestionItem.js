import { faArrowCircleDown, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap'

function CollapseQuestionItem({ index, toggle, collapse, data }) {
    return (
        <Card style={{ marginBottom: '1rem' }}>
            <CardHeader>
                <div className="d-flex justify-content-between align-items-center" onClick={toggle} data-event={index}>
                    <span onClick={toggle} data-event={index}><span dangerouslySetInnerHTML={{ __html: data.question }}></span></span>
                    <span onClick={toggle} data-event={index}>Jumlah Attempt: {data.answer.length} <FontAwesomeIcon onClick={toggle} data-event={index} className="ml-2" icon={faArrowCircleDown} /></span>
                </div>
            </CardHeader>
            <Collapse isOpen={collapse === index}>
                <CardBody>
                    <div className="text-muted">
                        <h6>Kunci Jawaban: </h6>{data.questionKey}
                    </div>
                    <hr />
                    {data.answer.map((val, index) => {
                        return (
                            <div className="mb-4" key={index}>
                                <Row>
                                    <Col md={6}>
                                        <h6>Tipe: <span className={val.type === "test" ? "text-warning" : "text-success"}>{val.type.toUpperCase()}</span> </h6>
                                        {val.text}
                                    </Col>
                                    <Col>
                                        <h2 className={(val.isEqual) ? "text-success" : "text-danger"}>
                                            <FontAwesomeIcon icon={(val.isEqual) ? faCheckCircle : faTimesCircle} />
                                        </h2>
                                    </Col>
                                </Row>

                                <hr />
                            </div>
                        )
                    })}
                </CardBody>
            </Collapse>
        </Card>
    )
}

export default CollapseQuestionItem
