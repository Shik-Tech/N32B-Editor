import { map } from 'lodash';
import React from 'react';
import KNOB_TYPES from './knobTypes';

function ChannelSelect({ disabled, channel, handleChannelChange }) {
    const options = [];
    for (let i = 0; i < 16; i++) {
        options[i] = i + 1;
    }
    return (
        <select disabled={disabled} value={channel} onChange={handleChannelChange}>
            <option value={0} key={0}>Use Global Channel</option>
            {map(options, value =>
                <option value={value} key={value}>Channel {value}</option>
            )}
        </select>
    )
}

function TypeSelect({ type, handleTypeSelect }) {
    return (
        <select select={type} value={type} onChange={handleTypeSelect}>
            <option value={KNOB_TYPES.DISABLE_KNOB}>Disabled</option>
            <option value={KNOB_TYPES.CONTROL_CHANGE}>Control Change</option>
        </select>
    )
}

function Form({
    type,
    value,
    channel,
    invert,
    handleTypeSelect,
    handleValueChange,
    handleChannelChange,
    handleInvertChange
}) {
    const isDisabled = type === KNOB_TYPES.DISABLE_KNOB;
    return (
        <>
            <div className="row editorRow">
                <div className="column">
                    <label>Type</label>
                    <TypeSelect type={type} handleTypeSelect={handleTypeSelect} />
                </div>
                {!isDisabled &&
                    <div className="column">
                        <label>Channel</label>
                        <ChannelSelect channel={channel} handleChannelChange={handleChannelChange} />
                    </div>
                }
            </div>
            {!isDisabled &&
                <div className="row editorRow">
                    <div className="column">
                        <label>Control Number</label>
                        <input type="number" min={0} max={127} value={value} onChange={handleValueChange} />
                    </div>

                    <div className="column">
                        <label>
                            <input type="checkbox" checked={invert} onChange={handleInvertChange} />
                            Invert
                        </label>
                    </div>
                </div>
            }
        </>
    )
}

export default Form;