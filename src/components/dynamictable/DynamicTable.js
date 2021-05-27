import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Button, Table } from 'reactstrap';

function DynamicTable({ data, name, isDelete }) {
    if (data.length === 0) {
        return <div>
            Data Kosong
        </div>
    }
    const keys = Object.keys(data[0]).map(key => key);
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-4">{name}</h5>
                {isDelete && (<Button outline color="danger">
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                    />
                </Button>)}
            </div>
            <Table responsive>
                <thead>
                    <tr>
                        {keys.map(key => <th key={key}>{key}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map(row => {
                        return (<tr key={row.id}>
                            {Object.values(row).map((val, index) => {
                                return <td key={index}>{val}</td>
                            })}
                        </tr>)
                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default DynamicTable
