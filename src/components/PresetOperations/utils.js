import { forEach } from 'lodash';

export function generateSysExFromPreset(currentPreset) {
    const messages = [];

    forEach(currentPreset.knobs, (knob, key) => {
        const {
            inverted,
            type,
            value,
            range,
            // minRange,
            // maxRange,
            channel,
        } = knob;

        const id = knob.hardwareId;
        // const type = knob.type;
        // const valOne = knob.valOne;
        // const valTwo = knob.valTwo;
        // const valThree = knob.valThree;
        // const valFour = knob.valFour;
        // const valCheck = knob.inverted;

        const knobMessage = [type, id];

        switch (type) {
            // CC
            case 1:
                knobMessage.push(value);
                knobMessage.push(0);
                break;
            // NPRN bipolar and unipolar
            case 2:
            case 3:
                knobMessage.push(LSHB(value));
                knobMessage.push(MSHB(value));
                knobMessage.push(range);
                break;
            // CC & Range
            // case 11:
            //     knobMessage.push(value);
            //     knobMessage.push(minRange);
            //     knobMessage.push(maxRange);
            //     break;
            // CC range on separate channel
            // case 12:
            //     knobMessage.push(value);
            //     knobMessage.push(minRange);
            //     knobMessage.push(maxRange);
            //     knobMessage.push(channel);
            //     break;
            // CC on separate channel
            case 15:
                knobMessage.push(value);
                knobMessage.push(channel);
                break;
            // Disabled
            case 16:
                break;
            // NPRN Extended
            case 18:
                knobMessage.push(LSHB(value));
                knobMessage.push(MSHB(value));
                knobMessage.push(range);
                break;

            default:
                break;
        }

        const invertMessage = [17, id];
        if (inverted) {
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