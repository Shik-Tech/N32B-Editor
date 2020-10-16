import { forEach } from 'lodash';

export function generateSysExFromPreset(currentPreset) {
    const messages = [];

    forEach(currentPreset.knobs, (value, key) => {
        const id = value.hardwareId;
        const type = value.type;
        const valOne = value.valOne;
        const valTwo = value.valTwo;
        const valThree = value.valThree;
        const valFour = value.valFour;
        const valCheck = value.inverted;

        const knobMessage = [type, id];

        switch (type) {
            // CC
            case 1:
                knobMessage.push(valOne);
                knobMessage.push(0);
                break;
            // NPRN bipolar and unipolar
            case 2:
            case 3:
                knobMessage.push(LSHB(valOne));
                knobMessage.push(MSHB(valOne));
                knobMessage.push(valTwo);
                break;
            case 11:
                knobMessage.push(valOne);
                knobMessage.push(valTwo);
                knobMessage.push(valThree);
                break;
            // CC range on separate channel
            case 12:
                knobMessage.push(valOne);
                knobMessage.push(valTwo);
                knobMessage.push(valThree);
                knobMessage.push(valFour);
                break;
            // CC on separate channel
            case 15:
                knobMessage.push(valOne);
                knobMessage.push(valTwo);
                break;
            // disabled
            case 16:
                break;
            // NPRN exponent
            case 18:
                knobMessage.push(LSHB(valOne));
                knobMessage.push(MSHB(valOne));
                knobMessage.push(valTwo);
                break;

            default:
                break;
        }

        const invertMessage = [17, id];
        if (valCheck) {
            invertMessage.push(1);
        } else {
            invertMessage.push(0);
        }

        messages.push(knobMessage);
        messages.push(invertMessage);
    });

    messages.push([9, currentPreset.channel]);

    if (currentPreset.NRPNMSB) {
        messages.push([19, 0]);
    } else {
        messages.push([19, 1]);
    }

    messages.push([5, currentPreset.presetID]);

    return messages;
}

function MSHB(val) {
    return Math.floor(val / 128);
}
function LSHB(val) {
    return val % 128;
}