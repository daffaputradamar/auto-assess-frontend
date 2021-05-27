import React from 'react'
import { Spinner as BSSpinner } from 'reactstrap'

function Spinner() {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <BSSpinner color="primary" className="btn-purple" size="lg" />
        </div>
    )
}

export default Spinner
