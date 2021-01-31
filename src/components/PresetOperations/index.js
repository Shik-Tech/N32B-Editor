import React, { useRef } from 'react';
import { generateSysExFromPreset } from './utils';
// import gear from "../images/gear4.svg";
import { forEach } from 'lodash';

const { dialog } = window.remote;
const jetpack = window.jetpack;

function PresetOperations(props) {
    const {
        updatePreset,
        currentPreset,
        midiOutput,
        // midiInput,
        updatePresetName,
        currentPresetIndex,
        updateCurrentPresetIndex
    } = props;
    const fileInput = useRef(null);

    const handlePresetSelect = e => {
        updateCurrentPresetIndex(parseInt(e.target.value));
    }

    const handleLoadPreset = e => {
        const reader = new FileReader();
        if (fileInput.current.files.length > 0) {
            const file = fileInput.current.files[0];
            updatePresetName(file.name);
            reader.onload = (event => {
                const preset = JSON.parse(event.target.result);
                updatePreset(preset);
            });
            reader.readAsText(file);
        }
    }

    const handleSavePreset = e => {
        const presetFilePath = dialog.showSaveDialogSync({
            title: "Save Preset",
            buttonLabel: "Save Preset"
        });
        if (presetFilePath) {
            try {
                jetpack.write(presetFilePath, currentPreset);
            }
            catch (err) {
                console.log('error: ', err);
            }
        }
    }

    const handleSaveToDevice = e => {
        const messages = generateSysExFromPreset(currentPreset);
        forEach(messages, message => {
            midiOutput.sendSysex(124, message);
            // midiOutput.sendSysex(32, message);
        });
    }

    // const handleLoadFromDevice = e => {
    //     midiOutput.sendSysex(124, [7]);
    // }

    return (
        <div className="editorContainer">
            <div className="row editorRow">
                <label>Load to editor:</label>
                <button
                    type="button"
                    onClick={() => fileInput.current.click()}
                >
                    Load Preset
                </button>
                <input
                    type="file"
                    ref={fileInput}
                    onChange={handleLoadPreset}
                />
            </div>
            <div className="row editorRow">
                <label>Backup preset:</label>

                <button
                    type="button"
                    onClick={handleSavePreset}
                >
                    Save Preset
                </button>
            </div>

            <div className="seperator"></div>

            {/* <div className="row editorRow">
                <label>Load from device</label>
                <button
                    type="button"
                    onClick={handleLoadFromDevice}
                >
                    Load from Device
                </button>
            </div>

            <div className="seperator"></div> */}

            <div className="subtitle">
                Write preset to device
            </div>
            <div className="row editorRow">
                <label>Write to:</label>
                <select value={currentPresetIndex} onChange={handlePresetSelect}>
                    <option value={0}>Preset 0</option>
                    <option value={1}>Preset 1</option>
                    <option value={2}>Preset 2</option>
                    <option value={3}>Preset 3</option>
                    <option value={4}>Preset 4</option>
                </select>
                <button
                    type="button"
                    onClick={handleSaveToDevice}
                >
                    Write to Device
                </button>
            </div>

            {/* {uploading &&
                <div id="gear">
                    <img
                        src={gear}
                        alt="gear icon"
                        className="spinning"
                    />
                </div>
            } */}
        </div>
    );
}

export default PresetOperations;