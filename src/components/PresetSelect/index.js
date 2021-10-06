import { map } from 'lodash';
import React from 'react';

function PresetSelect({ presets, currentPresetIndex, handlePresetChange }) {
    return (
        <select value={currentPresetIndex} onChange={handlePresetChange}>
            {map(presets, (preset, key) => <option key={key} value={key}>{preset.presetName}</option>)}
        </select>
    );
}

export default PresetSelect;