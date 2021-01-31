import React from 'react';
import { Knobs } from '../../components';
import './N32B.css';

function N32B(props) {
    return (
        <div className="N32B-container">
            <div className="N32B">
                <Knobs {...props} />
            </div>
        </div>
    );
}

export default N32B;