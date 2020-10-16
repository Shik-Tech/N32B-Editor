import React, { useEffect, useState } from 'react';
import WebMidi from 'webmidi';
import {
  N32B,
  KnobEditor,
  // FirmwareOperations,
  PresetOperations
} from './components';
import defaultPreset from './defaultPreset.json';
import './App.css';

function App() {
  const [selectedKnobIndex, setSelectedKnobIndex] = useState(0);
  const [deviceIsConnected, setDeviceIsConnected] = useState(false);
  const [midiInput, setMidiInput] = useState();
  const [midiOutput, setMidiOutput] = useState();
  const [currentPreset, updatePreset] = useState(defaultPreset);
  const [currentPresetIndex, updateCurrentPresetIndex] = useState(0);
  const [currentPresetName, updatePresetName] = useState('Default preset');

  const knobsPerRow = 8;
  
  useEffect(() => {
    WebMidi.enable((err) => {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      }
      WebMidi.addListener("connected", function (e) {
        setMidiInput(WebMidi.getInputByName("SHIK N32B"));
        setMidiOutput(WebMidi.getOutputByName("SHIK N32B"));
      });

      WebMidi.addListener("disconnected", function (e) {
        setMidiInput(WebMidi.getInputByName("SHIK N32B"));
        setMidiOutput(WebMidi.getOutputByName("SHIK N32B"));
      });
    }, true);
  });

  useEffect(() => {
    if (midiOutput && midiInput) {
      setDeviceIsConnected(true);
      midiInput.addListener('programchange', undefined, handleProgramChange);

      return () => {
        midiInput.removeListener('programchange', undefined, handleProgramChange);
      };
    } else {
      setDeviceIsConnected(false);
    }
  }, [midiInput, midiOutput]);

  useEffect(() => {
    if (midiOutput) {
      midiOutput.sendProgramChange(currentPresetIndex, 1);
      const newPreset = {
        ...currentPreset,
        presetID: currentPresetIndex
      }
      updatePreset(newPreset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPresetIndex]);

  const handleProgramChange = e => {
    updateCurrentPresetIndex(e.data[1]);
  }
  return (
    <div className="App">
      {!deviceIsConnected &&
        <div className="deviceNotConnected">
          <div className="title">Please connect the N32B to your computer with a data usb cable</div>
        </div>
      }
      {deviceIsConnected &&
        <>
          <div className="LeftSide">
            <div className="row">
              <div className="title">N32B Editor</div>
              <div className="row">
                <div className="presetNameTitle">Current loaded preset:</div>
                <div className="presetName">{currentPresetName}</div>
              </div>
            </div>
            <N32B
              knobsData={currentPreset.knobs}
              knobsPerRow={knobsPerRow}
              selectedKnobIndex={selectedKnobIndex}
              setSelectedKnob={setSelectedKnobIndex}
            />
          </div>
          <div className="RightSide">
            <div className="row">
              <div className="title">Editing Knob: <span className="currentKnob">{currentPreset.knobs[selectedKnobIndex].id}</span></div>
            </div>
            <KnobEditor
              selectedKnobIndex={selectedKnobIndex}
              updatePreset={updatePreset}
              currentPreset={currentPreset}
            />
            <div className="seperator"></div>
            <PresetOperations
              updatePreset={updatePreset}
              currentPreset={currentPreset}
              midiInput={midiInput}
              midiOutput={midiOutput}
              updatePresetName={updatePresetName}
              currentPresetIndex={currentPresetIndex}
              updateCurrentPresetIndex={updateCurrentPresetIndex}
            />
            {/* <div className="seperator"></div>
            <FirmwareOperations /> */}
          </div>
        </>
      }
    </div>
  );
}

export default App;
