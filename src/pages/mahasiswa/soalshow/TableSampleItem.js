import React, { useState } from 'react'
import { Collapse, Button, Table } from 'reactstrap';

function TableSampleItem({ table, data }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const keys = Object.keys(data[0]).map(key => key);

    return (
        <div>
            <Button color="info" outline onClick={toggle} style={{ marginBottom: '1rem' }}>Table {table}</Button>
            <Collapse isOpen={isOpen}>
                <Table size="sm">
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
            </Collapse>
        </div>
    )
}

export default TableSampleItem
