import React, { useEffect, useState } from 'react';

function KnobEditor({ selectedKnobIndex, currentPreset, updatePreset }) {
    const {
        type,
        msb,
        lsb,
        minValue,
        maxValue,
        channel,
    } = currentPreset.knobs[selectedKnobIndex];

    const [typeState, setTypeState] = useState(1);
    const [msbState, setMsbState] = useState(0);
    const [lsbState, setLsbState] = useState(0);
    const [maxMsbState, setMaxMsbState] = useState(127);
    const [minMsbState, setMinMsbState] = useState(0);
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
                        minValue: minMsbState,
                        maxValue: maxMsbState,
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
        minMsbState,
        maxMsbState,
        channelState
    ]);

    useEffect(() => {
        setTypeState(type);
        setMsbState(msb);
        setMinMsbState(minValue);
        setMaxMsbState(maxValue);
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
    }, [currentPreset.highResolution]);

    function handleTypeSelect(e) {
        setTypeState(parseInt(e.target.value));
    }

    function handleValueChange(e) {
        setMsbState(parseInt(e.target.value));
    }

    function handleLSBChange(e) {
        setLsbState(parseInt(e.target.value));
    }

    function handleChannelChange(e) {
        setChannelState(parseInt(e.target.value));
    }

    function handleMinValueChange(e) {
        setMinMsbState(e.target.value);
    }

    function handleMaxValueChange(e) {
        setMaxMsbState(e.target.value);
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
                        </div>
                    </div>

                    <div className="row editorRow">
                        <div className="column">
                            <label>{type === 3 ? "MSB Min Value" : "Min Value"}</label>
                            <input type="number" min={0} max={127} value={minValue} onChange={handleMinValueChange} />
                        </div>

                        <div className="column">
                            <label>{type === 3 ? "MSB Max Value" : "Max Value"}</label>
                            <input type="number" min={0} max={127} value={maxValue} onChange={handleMaxValueChange} />
                        </div>
                    </div>

                    {type === 2 &&
                        <div className="row editorRow">
                            <div className="column">
                                <label>Channel</label>
                                <input type="number" min={1} max={16} value={channel} onChange={handleChannelChange} />
                            </div>
                            <div className="column"></div>
                        </div>
                    }
                </>
            }


            {/* {!disableAllFields && (type === 11 || type === 12) &&
                <div className="row editorRow">
                    <label>Min Range:</label>
                    <input type="number" min={0} max={126} value={minRangeState} onChange={handleMinRangeChange} />
                </div>
            } */}

            {/* {!disableAllFields && (type === 11 || type === 12) &&
                <div className="row editorRow">
                    <label>Max Range:</label>
                    <input type="number" min={1} max={127} value={maxRangeState} onChange={handleMaxRangeChange} />
                </div>
            } */}


        </div>
    )
}

export default KnobEditor;