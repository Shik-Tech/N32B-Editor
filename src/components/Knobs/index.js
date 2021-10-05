import React from 'react';
import Knob from './Knob';
import './Knobs.css';

const chunks = (arr, size) => {
    const result = [];
    for (var i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, size + i));
    }

    return result;
};

function Knobs({ knobsData, knobsPerRow, selectedKnobIndex, setSelectedKnob }) {
    const rows = chunks(knobsData, knobsPerRow);
    return (
        <div className="KnobsContainer">
            {rows.map((knobsRowData, rowkey) =>
                <div className="KnobRow" key={rowkey}>
                    {knobsRowData.map((data, key) =>
                        <Knob
                            key={data.id}
                            {...data}
                            setSelectedKnob={setSelectedKnob}
                            selectedKnobIndex={selectedKnobIndex} />
                    )}
                </div>
            )}
        </div>
    )
}

export default Knobs;





