import React from 'react';

function Knob({ id, setSelectedKnob, selectedKnobIndex }) {
    const handleClick = () => {
        setSelectedKnob(id - 1);
    }

    let className = 'Knob';
    if (selectedKnobIndex === id - 1) {
        className += ' Knob-selected'
    }

    return (
        <div className={className} onClick={handleClick}></div>
    );
}

export default Knob;