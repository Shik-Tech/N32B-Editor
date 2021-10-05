import React from 'react';

function Knob({ id, setSelectedKnob, selectedKnobIndex }) {
    const handleClick = () => {
        setSelectedKnob(id - 1);
    }

    let className = '';
    if (selectedKnobIndex === id - 1) {
        className += ' knob-selected'
    }

    return (
        <div className={'knobContainer' + className}>
            <div className="knobId">{id}</div>
            <div className="knob" onClick={handleClick}></div>
        </div>
    );
}

export default Knob;