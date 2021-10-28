import React, { useEffect, useState } from 'react';
// import { validateValueRange } from '../PresetOperations/utils';
import Form from './Form';
import KNOB_TYPES from './knobTypes';

function DualModeEditor({ selectedKnobIndex, currentPreset, updatePreset, setIsPristine }) {
    const [
        {
            type: type1,
            value: value1,
            channel: channel1,
            invert: invertValue1
        },
        {
            type: type2,
            value: value2,
            channel: channel2,
            invert: invertValue2
        }
    ] = currentPreset.knobs[selectedKnobIndex].knobPair;

    const [type1State, setType1State] = useState(1);
    const [type2State, setType2State] = useState(11);
    const [value1State, setValue1State] = useState(0);
    const [value2State, setValue2State] = useState(0);
    const [channel1State, setChannel1State] = useState(1);
    const [channel2State, setChannel2State] = useState(1);
    const [invertValue1State, setInvertValue1] = useState(false);
    const [invertValue2State, setInvertValue2] = useState(false);


    useEffect(() => {
        updatePreset(prev => ({
            ...prev,
            knobs:
                [
                    ...currentPreset.knobs.slice(0, selectedKnobIndex),
                    {
                        ...currentPreset.knobs[selectedKnobIndex],
                        knobPair: [
                            {
                                type: type1State,
                                value: value1State,
                                channel: channel1State,
                                invert: invertValue1State
                            },
                            {
                                ...currentPreset.knobs[selectedKnobIndex].knobPair[1]
                            }
                        ]
                    },
                    ...currentPreset.knobs.slice(selectedKnobIndex + 1)
                ]
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        type1State,
        value1State,
        channel1State,
        invertValue1State
    ]);

    useEffect(() => {
        updatePreset(prev => ({
            ...prev,
            knobs:
                [
                    ...currentPreset.knobs.slice(0, selectedKnobIndex),
                    {
                        ...currentPreset.knobs[selectedKnobIndex],
                        knobPair: [
                            {
                                ...currentPreset.knobs[selectedKnobIndex].knobPair[0]
                            },
                            {
                                type: type2State,
                                value: value2State,
                                channel: channel2State,
                                invert: invertValue2State
                            }
                        ]
                    },
                    ...currentPreset.knobs.slice(selectedKnobIndex + 1)
                ]
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        type2State,
        value2State,
        channel2State,
        invertValue2State
    ]);

    useEffect(() => {
        setType1State(type1);
        setType2State(type2);
        setChannel1State(channel1);
        setChannel2State(channel2);
        setInvertValue1(invertValue1);
        setInvertValue2(invertValue2);
        setValue1State(value1);
        setValue2State(value2);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKnobIndex]);

    function handleInvertValue1Change(e) {
        setIsPristine(false);
        setInvertValue1(e.target.checked);
    }
    function handleInvertValue2Change(e) {
        setIsPristine(false);
        setInvertValue2(e.target.checked);
    }
    function handleType1Select(e) {
        setIsPristine(false);
        const value = parseInt(e.target.value);
        setType1State(value);
        if (value !== KNOB_TYPES.DISABLE_KNOB) {
            setValue1State(0);
        }
    }
    function handleType2Select(e) {
        setIsPristine(false);
        const value = parseInt(e.target.value);
        setType2State(value);
        if (value !== KNOB_TYPES.DISABLE_KNOB) {
            setValue2State(0);
        }
    }
    function handleValue1Change(e) {
        setIsPristine(false);
        setValue1State(parseInt(e.target.value));
    }
    function handleValue2Change(e) {
        setIsPristine(false);
        setValue2State(parseInt(e.target.value));
    }
    function handleChannel1Change(e) {
        setIsPristine(false);
        setChannel1State(parseInt(e.target.value));
    }
    function handleChannel2Change(e) {
        setIsPristine(false);
        setChannel2State(parseInt(e.target.value));
    }

    return (
        <div className="editorContainer">
            <Form
                type={type1}
                value={value1}
                channel={channel1}
                invert={invertValue1}
                handleTypeSelect={handleType1Select}
                handleValueChange={handleValue1Change}
                handleChannelChange={handleChannel1Change}
                handleInvertChange={handleInvertValue1Change}
            />
            <div className="seperator border"></div>
            <Form
                type={type2}
                value={value2}
                channel={channel2}
                invert={invertValue2}
                handleTypeSelect={handleType2Select}
                handleValueChange={handleValue2Change}
                handleChannelChange={handleChannel2Change}
                handleInvertChange={handleInvertValue2Change}
            />
        </div>
    )
}

export default DualModeEditor;