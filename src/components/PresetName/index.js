import React from 'react';

function PresetName({ presetName, handlePresetNameChange }) {
    return (
        <input value={presetName} onChange={handlePresetNameChange} />
    );
}

export default PresetName;