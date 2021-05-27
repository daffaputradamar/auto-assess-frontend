import React, { useState } from 'react'
import CollapseQuestionItem from './CollapseQuestionItem';

function Accordion({ data }) {

    const [collapse, setCollapse] = useState(0)

    const toggle = e => {
        let event = e.target.dataset.event;
        setCollapse(collapse === Number(event) ? 0 : Number(event))
    }

    return (
        <div className="container">
            {data.map((val, index) => {
                return <CollapseQuestionItem key={index} index={++index} collapse={collapse} toggle={toggle} data={val} />
            })}

        </div>
    );
}

export default Accordion
