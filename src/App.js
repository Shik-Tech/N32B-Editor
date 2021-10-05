import React, { useEffect, useState } from 'react';
import WebMidi from 'webmidi';
import {
  N32B,
  MK1Editor,
  MK2Editor,
  PresetOperations,
  ConnectDevice
} from './components';
import { defaultPresetMK1, defaultPresetMK2 } from './presetTemplates';
import Version from './components/Version';
import Popup from 'react-popup';

import './App.css';
import './Popup.css';

function App() {
  const appVersion = "v1.1.0";
  const knobsPerRow = 8;

  const [selectedKnobIndex, setSelectedKnobIndex] = useState(0);
  const [deviceIsConnected, setDeviceIsConnected] = useState(false);
  const [midiInput, setMidiInput] = useState();
  const [midiOutput, setMidiOutput] = useState();
  const [currentPreset, updatePreset] = useState();
  const [currentPresetIndex, updateCurrentPresetIndex] = useState(0);
  const [currentPresetName, updatePresetName] = useState('Default preset');
  const [highResolution, updateHighResolution] = useState(true);
  const [isMK2, setIsMK2] = useState();

  useEffect(() => {
    WebMidi.enable((err) => {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      }
      WebMidi.addListener("connected", function (e) {
        if (WebMidi.getInputByName("N32B MK2")) {
          setIsMK2(true);
          updatePreset(defaultPresetMK2);
          setMidiInput(WebMidi.getInputByName("N32B MK2"));
          setMidiOutput(WebMidi.getOutputByName("N32B MK2"));
        } else if (WebMidi.getInputByName("N32B")) {
          setIsMK2(false);
          updatePreset(defaultPresetMK1);
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
    if (midiOutput) {
      midiOutput.sendProgramChange(currentPresetIndex, 1);

      updatePreset(prev => ({
        ...prev,
        presetID: currentPresetIndex
      }));
    }
  }, [currentPresetIndex, midiOutput]);

  useEffect(() => {
    updatePreset(prev => ({
      ...prev,
      highResolution
    }));
  }, [highResolution]);

  const handleProgramChange = e => {
    updateCurrentPresetIndex(e.data[1]);
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
              <div className="title">N32B Editor</div>
              <div className="row">
                <div className="headerTitle2">Device:</div>
                <div className="headerValue">{midiOutput.name}</div>
              </div>
              <div className="seperator border horizon"></div>
              <div className="row">
                <div className="headerTitle2">Preset:</div>
                <div className="headerValue">{currentPresetName}</div>
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
              {!isMK2 &&
                <label className="highResolution">
                  <input type="checkbox" checked={highResolution} onChange={handleHighResolutionChange} /> Hi-Res
                </label>
              }
            </div>
            <div className="seperator"></div>
            <div className="row flex-2">
              {isMK2 &&
                <MK2Editor
                  selectedKnobIndex={selectedKnobIndex}
                  currentPreset={currentPreset}
                  updatePreset={updatePreset}
                />
              }
              {!isMK2 &&
                <MK1Editor
                  selectedKnobIndex={selectedKnobIndex}
                  currentPreset={currentPreset}
                  updatePreset={updatePreset}
                />
              }
            </div>
            <div className="seperator border"></div>
            <div className="row">
              <PresetOperations
                isMK2={isMK2}
                currentPreset={currentPreset}
                midiInput={midiInput}
                midiOutput={midiOutput}
                currentPresetIndex={currentPresetIndex}
                updatePreset={updatePreset}
                updatePresetName={updatePresetName}
                updateCurrentPresetIndex={updateCurrentPresetIndex}
              />
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default App;
