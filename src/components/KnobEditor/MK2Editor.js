import React, { useEffect, useState } from 'react';
import { validateValueRange } from '../PresetOperations/utils';
import Form from './Form';

function MK2Editor({ selectedKnobIndex, currentPreset, updatePreset }) {
    const {
        type: type1,
        value: value1,
        channel: channel1,
        invert: invertValue1
    } = currentPreset.knobs[selectedKnobIndex].knobPair[0];
    const {
        type: type2,
        value: value2,
        channel: channel2,
        invert: invertValue2
    } = currentPreset.knobs[selectedKnobIndex].knobPair[1];

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
        type1State,
        type2State,
        value1State,
        value2State,
        channel1State,
        channel2State,
        invertValue1State,
        invertValue2State
    ]);

    useEffect(() => {
        setType1State(type1);
        setType2State(type2);
        setChannel1State(channel1);
        setChannel2State(channel2);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKnobIndex]);

    function handleInvertValue1Change(e) {
        setInvertValue1(e.target.value);
    }
    function handleInvertValue2Change(e) {
        setInvertValue2(e.target.value);
    }
    function handleType1Select(e) {
        setType1State(parseInt(e.target.value));
    }
    function handleType2Select(e) {
        setType2State(parseInt(e.target.value));
    }
    function handleValue1Change(e) {
        setValue1State(parseInt(validateValueRange(e.target)));
    }
    function handleValue2Change(e) {
        setValue2State(parseInt(validateValueRange(e.target)));
    }
    function handleChannel1Change(e) {
        setChannel1State(parseInt(e.target.value));
    }
    function handleChannel2Change(e) {
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

export default MK2Editor;