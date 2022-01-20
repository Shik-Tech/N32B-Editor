import React, { useRef } from 'react';
import { generateSysExFromPreset, generateSysExFromPreset_MK2 } from './utils';
import { forEach } from 'lodash';
import Popup from 'react-popup';
// import webmidi from 'webmidi';

console.log(window.electron);
// const { dialog } = window.electron;
const jetpack = window.jetpack;

function PresetOperations(props) {
    const {
        isDualMode,
        currentPreset,
        // midiInput,
        // midiOutput,
        handleLoadNewPreset,
        currentDevicePresetIndex,
        updateCurrentDevicePresetIndex
    } = props;
    const fileInput = useRef(null);

    const handlePresetSelect = e => {
        updateCurrentDevicePresetIndex(parseInt(e.target.value));
    }

    const handleLoadPreset = e => {
        const reader = new FileReader();
        if (fileInput.current.files.length > 0) {
            const file = fileInput.current.files[0];
            // updatePresetName(file.name);
            reader.onload = (event => {
                const preset = JSON.parse(event.target.result);
                handleLoadNewPreset(preset);
                updateCurrentDevicePresetIndex(0);
            });
            reader.readAsText(file);
        }
    }

    const handleSavePreset = e => {
        // const presetFilePath = dialog.showSaveDialogSync({
        //     title: 'Save Preset',
        //     buttonLabel: 'Save Preset'
        // });
        // if (presetFilePath) {
        //     try {
        //         jetpack.write(presetFilePath, currentPreset);
        //     }
        //     catch (err) {
        //         console.log('error: ', err);
        //     }
        // }
    }

    const handleSaveToDevice = e => {
        const action = function () {
            const messages = isDualMode ?
                generateSysExFromPreset_MK2(currentPreset) : generateSysExFromPreset(currentPreset);
            forEach(messages, message => {
                // console.log(webmidi.outputs[0].sendSysex(32, message));

                console.log(message);
                // midiOutput.sendSysex(32, message);
            });
            Popup.close();
        };

        Popup.create({
            title: 'Write to device',
            content: `You are about to overwrite "Preset ${currentPreset.presetID}".`,
            buttons: {
                left: [{
                    text: 'Cancel',
                    className: 'danger',
                    action: function () {
                        Popup.close();
                    }
                }],
                right: [{
                    text: 'Write to Device',
                    className: 'success',
                    action
                }]
            }
        });

    }

    // async function showWarning() {
    //     return;
    // }

    // const handleLoadFromDevice = e => {
    //     midiOutput.sendSysex(124, [7]);
    // }

    return (
        <div className="editorContainer">
            <div className="row editorRow">
                <div className="column">
                    <button
                        type="button"
                        onClick={() => fileInput.current.click()}
                    >
                        Load Preset<br />
                        to the editor
                    </button>
                    <input
                        className="hiddenField"
                        type="file"
                        ref={fileInput}
                        onChange={handleLoadPreset}
                    />
                </div>
                <div className="column">
                    <button
                        type="button"
                        onClick={handleSavePreset}
                        className="good"
                    >
                        Save Preset<br />
                        to your computer
                    </button>
                </div>
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

            <div className="row editorRow">
                <label>Write to:</label>
                <select value={currentDevicePresetIndex} onChange={handlePresetSelect}>
                    <option value={0}>Preset 0</option>
                    <option value={1}>Preset 1</option>
                    <option value={2}>Preset 2</option>
                    <option value={3}>Preset 3</option>
                    <option value={4}>Preset 4</option>
                </select>
                <button
                    type="button"
                    onClick={handleSaveToDevice}
                    className="danger"
                >
                    Write to Device
                </button>
            </div>
        </div>
    );
}

export default PresetOperations;