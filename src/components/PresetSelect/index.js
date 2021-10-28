import { map } from 'lodash';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';
import { PresetName } from '..';

function UIEditMode({ presets, currentPresetIndex, handlePresetNameChange, handleClick }) {
    const {
        presetName
    } = presets[currentPresetIndex];

    return (
        <div className="row presetSelect">
            <div className="column">
                <label>Presets:</label>
                <PresetName
                    name={presetName}
                    handlePresetNameChange={handlePresetNameChange} />
            </div>
            <div className="column buttonContainer">
                <button onClick={handleClick}>
                    <FontAwesomeIcon
                        icon={faCheck} />
                </button>
            </div>
        </div>
    )
}

function UISelectMode({ presets, currentPresetIndex, handlePresetChange, handleClick }) {
    return (
        <div className="row presetSelect">
            <div className="column">
                <label>Presets:</label>
                <select value={currentPresetIndex} onChange={handlePresetChange}>
                    {map(presets, (preset, key) =>
                        <option key={key} value={key}>{preset.presetName}</option>)}
                </select>
            </div>
            {presets[currentPresetIndex].presetName === 'User Custom' &&
                <div className="column buttonContainer">
                    <button onClick={handleClick}>
                        <FontAwesomeIcon
                            icon={faEdit} />
                    </button>
                </div>
            }
        </div>
    )
}

function PresetSelect(props) {
    const [editMode, setEditMode] = useState(false);

    const handleClick = e => {
        setEditMode(!editMode);
    }
    if (editMode) {
        return (
            <UIEditMode
                {...props}
                handleClick={handleClick} />
        );
    }

    return (
        <UISelectMode
            {...props}
            handleClick={handleClick} />
    );
}

export default PresetSelect;