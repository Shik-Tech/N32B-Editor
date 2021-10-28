import React, { useEffect, useState } from 'react';
import { validateValueRange } from '../PresetOperations/utils';

function HighResEditor({ selectedKnobIndex, currentPreset, updatePreset, setIsPristine }) {
    const {
        type,
        msb,
        lsb,
        channel,
    } = currentPreset.knobs[selectedKnobIndex];

    const [typeState, setTypeState] = useState(1);
    const [msbState, setMsbState] = useState(0);
    const [lsbState, setLsbState] = useState(0);
    const [channelState, setChannelState] = useState(1);
    const [disableAllFields, setDisableAllFields] = useState(false);
    const [maxValueRangeState, setMaxValueRangeState] = useState(31);

    useEffect(() => {
        setDisableAllFields(typeState === 11);

        updatePreset(prev => ({
            ...prev,
            knobs:
                [
                    ...currentPreset.knobs.slice(0, selectedKnobIndex),
                    {
                        ...currentPreset.knobs[selectedKnobIndex],
                        type: typeState,
                        msb: msbState,
                        lsb: lsbState,
                        channel: channelState
                    },
                    ...currentPreset.knobs.slice(selectedKnobIndex + 1)
                ]
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        typeState,
        msbState,
        lsbState,
        channelState
    ]);

    useEffect(() => {
        setTypeState(type);
        setMsbState(msb);
        setLsbState(lsb);
        setChannelState(channel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKnobIndex]);

    useEffect(() => {
        if (currentPreset.highResolution && (typeState === 1 || typeState === 2)) {
            setMaxValueRangeState(31);
            if (msbState > 31) {
                setMsbState(0);
            }
        } else {
            setMaxValueRangeState(127);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPreset.highResolution, typeState]);

    function handleTypeSelect(e) {
        setIsPristine(false);
        setTypeState(parseInt(e.target.value));
    }

    function handleValueChange(e) {
        setIsPristine(false);
        setMsbState(parseInt(validateValueRange(e.target)));
    }

    function handleLSBChange(e) {
        setIsPristine(false);
        setLsbState(parseInt(validateValueRange(e.target)));
    }

    function handleChannelChange(e) {
        setIsPristine(false);
        setChannelState(parseInt(validateValueRange(e.target)));
    }

    return (
        <div className="editorContainer">
            <div className="row editorRow">
                <label>Type</label>
                <select value={type} onChange={handleTypeSelect}>
                    <option value={11}>Disable Knob</option>
                    <option value={1}>Control Change</option>
                    <option value={2}>CC & Channel</option>
                    <option value={3}>NRPN</option>
                </select>
            </div>

            {!disableAllFields &&
                <>
                    <div className="row editorRow">
                        <div className="column">
                            <label>{type === 3 ? "NRPN MSB" : "Control Number"}</label>
                            <input type="number" min={0} max={maxValueRangeState} value={msb} onChange={handleValueChange} />
                        </div>

                        <div className="column">
                            {type === 3 &&
                                <>
                                    <label>NRPN LSB</label>
                                    <input type="number" min={0} max={127} value={lsb} onChange={handleLSBChange} />
                                </>
                            }
                            {type === 2 &&
                                <>
                                    <label>Channel</label>
                                    <input type="number" min={1} max={16} value={channel} onChange={handleChannelChange} />
                                </>
                            }
                        </div>
                    </div>

                </>
            }
        </div>
    )
}

export default HighResEditor;