import React, { useState, useRef } from "react";
import AvrgirlArduino from 'avrgirl-arduino';
import gear from "../images/gear4.svg";

function FirmwareOperations() {
    const fileInput = useRef(null);
    const [fileName, updateFileName] = useState("");
    const [uploading, updateUploading] = useState(false);

    const handleSubmit = e => {
        updateUploading(true);

        const reader = new FileReader();
        reader.readAsArrayBuffer(fileInput.current.files[0]);

        reader.onload = event => {
            const filecontents = event.target.result;

            const avrgirl = new AvrgirlArduino({
                board: 'leonardo',
                debug: true
            });

            avrgirl.flash(filecontents, error => {
                if (error) {
                    console.error(error);
                } else {
                    console.info('Flash successful');
                }
                updateUploading(false);
            });
        };
    };


    return (
        <div className="operationsContainer">
            <div className="title">Firmware update</div>

            <div className="column">
                <button
                    type="button"
                    aria-controls="fileInput"
                    onClick={() => fileInput.current.click()}
                >Choose file</button>
                <input
                    type="file"
                    ref={fileInput}
                    onChange={() => {
                        if (fileInput.current.files.length > 0) {
                            return updateFileName(fileInput.current.files[0].name);
                        }
                    }
                    }
                />
                <span id="fileName">
                    {fileName ? fileName : "No file chosen"}
                </span>
            </div>

            <div className="column">
                <button type="button" onClick={handleSubmit} disabled={!fileName}>Update</button>
            </div>

            {uploading &&
                <div id="gear">
                    <img
                        src={gear}
                        alt="gear icon"
                        className="spinning"
                    />
                </div>
            }
        </div>
    );
}

export default FirmwareOperations;