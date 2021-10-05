import { map } from 'lodash';
import React from 'react';
import KNOB_TYPES from './knobTypes';

function ChannelSelect({ channel, handleChannelChange }) {
    const options = [];
    for (let i = 0; i < 16; i++) {
        options[i] = i + 1;
    }
    return (
        <select value={channel} onChange={handleChannelChange}>
            <option value={0} key={0}>Use Global Channel</option>
            {map(options, value =>
                <option value={value} key={value}>Channel {value}</option>
            )}
        </select>
    )
}

function Form({
    enable,
    type,
    value,
    channel,
    invert,
    handleTypeSelect,
    handleValueChange,
    handleChannelChange,
    handleInvertChange
}) {
    return (
        <>
            <div className="row editorRow">
                <div className="column">
                    <select select={type} value={type} onChange={handleTypeSelect}>
                        <option value={KNOB_TYPES.DISABLE_KNOB}>Disabled</option>
                        <option value={KNOB_TYPES.CONTROL_CHANGE}>Control Change</option>
                    </select>
                </div>
            </div>

            {type !== KNOB_TYPES.DISABLE_KNOB &&
                <div className="row editorRow">
                    <div className="column">
                        <label>Control Number</label>
                        <input type="number" min={0} max={127} value={value} onChange={handleValueChange} />
                    </div>

                    <div className="column">
                        <label>Channel</label>
                        <ChannelSelect channel={channel} handleChannelChange={handleChannelChange} />
                    </div>
                </div>
            }
        </>
    )
}

export default Form;