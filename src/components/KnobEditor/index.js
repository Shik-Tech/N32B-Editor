import React, { useEffect, useState } from 'react';

function KnobEditor({ selectedKnobIndex, currentPreset, updatePreset }) {
    const {
        inverted,
        type,
        value,
        range,
        // minRange,
        // maxRange,
        channel,
    } = currentPreset.knobs[selectedKnobIndex];

    const [typeState, setTypeState] = useState(1);
    const [valueState, setValueState] = useState(0);
    const [valueMaxPropState, setValueMaxPropState] = useState(127);
    const [channelState, setChannelState] = useState(1);
    // const [minRangeState, setMinRangeState] = useState(0);
    // const [maxRangeState, setMaxRangeState] = useState(127);
    const [rangeState, setRangeState] = useState(4);
    const [rangeMaxPropState, setRangeMaxPropState] = useState(127);
    const [invertState, setInvertState] = useState(false);
    const [disableAllFields, setDisableAllFields] = useState(false);

    useEffect(() => {
        updatePreset({
            ...currentPreset,
            knobs:
                [
                    ...currentPreset.knobs.slice(0, selectedKnobIndex),
                    {
                        ...currentPreset.knobs[selectedKnobIndex],
                        inverted: invertState,
                        type: typeState,
                        value: valueState,
                        range: rangeState,
                        // minRange: minRangeState,
                        // maxRange: maxRangeState,
                        channel: channelState
                    },
                    ...currentPreset.knobs.slice(selectedKnobIndex + 1)
                ]
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        invertState,
        typeState,
        valueState,
        // minRangeState,
        // maxRangeState,
        channelState,
        rangeState
    ]);

    useEffect(() => {
        setTypeState(type);
        setValueState(value);
        setChannelState(channel);
        setInvertState(inverted);
        setRangeState(range);
        // setMinRangeState(minRange);
        // setMaxRangeState(maxRange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKnobIndex]);

    useEffect(() => {
        setInvertState(invertState || false);
        let valueMaxProp;
        let rangeMaxProp;
        let range = 0;
        switch (typeState) {
            case 1:
            case 11:
            case 12:
            case 15:
                setDisableAllFields(false);
                valueMaxProp = 127;
                break;
            case 2:
                setDisableAllFields(false);
                valueMaxProp = 16383;
                rangeMaxProp = 63;
                range = 63;
                break;
            case 3:
                setDisableAllFields(false);
                valueMaxProp = 16383;
                rangeMaxProp = 127;
                range = 127;
                break;
            case 18:
                setDisableAllFields(false);
                valueMaxProp = 16383;
                rangeMaxProp = 4;
                range = 4;
                break;
            case 16:
                setDisableAllFields(true);
                break;

            default:
                break;
        }
        if (valueState > valueMaxProp) {
            setValueState(0);
        }
        setValueMaxPropState(valueMaxProp);
        setRangeMaxPropState(rangeMaxProp);
        setRangeState(rangeState || range);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeState]);

    function handleTypeSelect(e) {
        setTypeState(parseInt(e.target.value));
    }

    function handleValueChange(e) {
        setValueState(parseInt(e.target.value));
    }

    function handleChannelChange(e) {
        setChannelState(parseInt(e.target.value));
    }

    // function handleMinRangeChange(e) {
    //     setMinRangeState(parseInt(e.target.value));
    // }

    // function handleMaxRangeChange(e) {
    //     setMaxRangeState(parseInt(e.target.value));
    // }

    function handleRangeChange(e) {
        setRangeState(parseInt(e.target.value));
    }

    function handleInvertChange(e) {
        setInvertState(!!e.target.checked);
    }

    return (
        <div className="editorContainer">
            <div className="row editorRow">
                <label>Type:</label>
                <select value={type} onChange={handleTypeSelect}>
                    <option value={16}>Disable Knob</option>
                    <option value={1}>Control Change</option>
                    <option value={15}>CC & Channel</option>
                    {/* <option value={11}>CC & Range</option> */}
                    {/* <option value={12}>CC, Range & Channel</option> */}
                    <option value={2}>NRPN Bipolar</option>
                    <option value={3}>NRPN Unipolar</option>
                    <option value={18}>NRPN Extended</option>
                </select>
            </div>

            {!disableAllFields &&
                <div className="row editorRow">
                    <label>Value:</label>
                    <input type="number" min={0} max={valueMaxPropState} value={value} onChange={handleValueChange} />
                </div>
            }

            {!disableAllFields && (/* type === 12 || */ type === 15) &&
                <div className="row editorRow">
                    <label>Channel:</label>
                    <input type="number" min={1} max={16} value={channel} onChange={handleChannelChange} />
                </div>
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

            {!disableAllFields && (type === 2 || type === 3 || type === 18) &&
                <div className="row editorRow">
                    <label>Range:</label>
                    <input type="number" min={1} max={rangeMaxPropState} value={range} onChange={handleRangeChange} />
                </div>
            }

            {!disableAllFields &&
                <div className="row editorRow">
                    <label>Invert:</label>
                    <input type="checkbox" checked={inverted} onChange={handleInvertChange} />
                </div>
            }
        </div>
    )
}

export default KnobEditor;