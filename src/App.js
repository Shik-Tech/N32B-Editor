import React, { useEffect, useState } from 'react';
import WebMidi from 'webmidi';
import {
  N32B,
  HighResEditor,
  DualModeEditor,
  PresetOperations,
  ConnectDevice
} from './components';
import { dualModePresets, highResPresets } from './presetTemplates';
import Version from './components/Version';
import Popup from 'react-popup';

import './App.css';
import './Popup.css';
import PresetSelect from './components/PresetSelect';

function App() {
  const appVersion = "v1.1.0";
  const knobsPerRow = 8;

  const [selectedKnobIndex, setSelectedKnobIndex] = useState(0);
  const [deviceIsConnected, setDeviceIsConnected] = useState(false);
  const [midiInput, setMidiInput] = useState(null);
  const [midiOutput, setMidiOutput] = useState(null);
  const [currentPreset, updatePreset] = useState();
  const [currentPresetIndex, updateCurrentPresetIndex] = useState(0);
  const [currentDevicePresetIndex, updateCurrentDevicePresetIndex] = useState(0);
  // const [currentPresetName, updatePresetName] = useState('');
  const [highResolution, updateHighResolution] = useState(true);
  const [isDualMode, setIsDualMode] = useState();
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    WebMidi.enable((err) => {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      }
      WebMidi.addListener("connected", function (e) {
        if (WebMidi.getInputByName("N32B MK2")) {
          setIsDualMode(true);
          setPresets(dualModePresets);
          setMidiInput(WebMidi.getInputByName("N32B MK2"));
          setMidiOutput(WebMidi.getOutputByName("N32B MK2"));
        } else if (WebMidi.getInputByName("N32B")) {
          setIsDualMode(false);
          setPresets(highResPresets);
          setMidiInput(WebMidi.getInputByName("N32B"));
          setMidiOutput(WebMidi.getOutputByName("N32B"));
        }
      });

      WebMidi.addListener("disconnected", function (e) {
        setMidiInput(null);
        setMidiOutput(null);
      });
    }, true);
  });

  useEffect(() => {
    if (midiOutput && midiInput) {
      setDeviceIsConnected(true);
      midiInput.addListener('programchange', undefined, handleProgramChange);
      midiInput.addListener('sysex', 'all', handleSysex);

      return () => {
        midiInput.removeListener('programchange', undefined, handleProgramChange);
        midiInput.removeListener('sysex', undefined, handleSysex);
      };
    } else {
      Popup.close();
      setDeviceIsConnected(false);
    }
  }, [midiInput, midiOutput]);

  useEffect(() => {
    if (presets.length > 0) {
      updatePreset(presets[currentPresetIndex]);
    }
  }, [presets, currentPresetIndex]);

  useEffect(() => {
    if (midiOutput) {
      midiOutput.sendProgramChange(currentDevicePresetIndex, 1);

      updatePreset(prev => ({
        ...prev,
        presetID: currentDevicePresetIndex
      }));
    }
  }, [currentDevicePresetIndex, midiOutput]);


  useEffect(() => {
    updatePreset(prev => ({
      ...prev,
      highResolution
    }));
  }, [highResolution]);

    const handlePresetChange = e => {
      updateCurrentPresetIndex(parseInt(e.target.value));
    }
  const handleProgramChange = e => {
    updateCurrentDevicePresetIndex(e.data[1]);
  }

  const handleHighResolutionChange = e => {
    updateHighResolution(!!e.target.checked);
  }

  const handleSysex = e => {
    console.log(e);
  }

  return (
    <div className="App">
      {!deviceIsConnected &&
        <ConnectDevice />
      }
      {deviceIsConnected &&
        <>
          <div className="leftSide">
            <div className="row">
              {/* <div className="title">N32B Editor</div> */}
              <div className="row">
                <div className="headerTitle2">Device:</div>
                <div className="headerValue">{midiOutput.name}</div>
              </div>
              <div className="seperator border horizon"></div>
              <div className="row">
                <div className="headerTitle2">Presets:</div>
                <PresetSelect
                  handlePresetChange={handlePresetChange}
                  currentPresetIndex={currentPresetIndex}
                  presets={presets}
                />
                {/* <div className="headerValue">{currentPresetName}</div> */}
              </div>
            </div>
            <div className="seperator"></div>
            <N32B
              knobsData={currentPreset.knobs}
              knobsPerRow={knobsPerRow}
              selectedKnobIndex={selectedKnobIndex}
              setSelectedKnob={setSelectedKnobIndex}
            />
            <Version appVersion={appVersion} />
          </div>
          <div className="rightSide">
            <div className="row">
              <div className="title">
                Editing Knob: <span className="currentKnob">{currentPreset.knobs[selectedKnobIndex].id}</span>
              </div>
              {!isDualMode &&
                <label className="highResolution">
                  <input type="checkbox" checked={highResolution} onChange={handleHighResolutionChange} /> Hi-Res
                </label>
              }
            </div>
            <div className="seperator"></div>
            <div className="row flex-2">
              {!isDualMode &&
                <HighResEditor
                  selectedKnobIndex={selectedKnobIndex}
                  currentPreset={currentPreset}
                  updatePreset={updatePreset}
                />
              }
              {isDualMode &&
                <DualModeEditor
                  selectedKnobIndex={selectedKnobIndex}
                  currentPreset={currentPreset}
                  updatePreset={updatePreset}
                />
              }
            </div>
            <div className="seperator border"></div>
            <div className="row">
              <PresetOperations
                isDualMode={isDualMode}
                currentPreset={currentPreset}
                midiInput={midiInput}
                midiOutput={midiOutput}
                currentDevicePresetIndex={currentDevicePresetIndex}
                updatePreset={updatePreset}
                // updatePresetName={updatePresetName}
                updateCurrentDevicePresetIndex={updateCurrentDevicePresetIndex}
              />
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default App;
