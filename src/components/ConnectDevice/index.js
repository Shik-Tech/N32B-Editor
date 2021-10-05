import React from 'react';

function ConnectDevice() {
    return (
        <div className="deviceNotConnected">
            <div className="column">
                <div className="title">N32B Editor</div>
                <div className="subtitle">Please connect the N32B to your computer with a data usb cable</div>
                <sub>* Make sure you connect only one N32B device while using the editor</sub>
            </div>
        </div>
    )
}

export default ConnectDevice;
