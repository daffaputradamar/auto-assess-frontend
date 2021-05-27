import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { Button } from 'reactstrap'

function ButtonKembali({ history }) {
    return (
        <Button color="link" className="text-secondary" onClick={() => history.goBack()}> <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Kembali </Button>
    )
}

export default ButtonKembali
