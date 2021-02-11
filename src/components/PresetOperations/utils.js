import { forEach } from 'lodash';

export function generateSysExFromPreset(currentPreset) {
    const messages = [];
    const {
        highResolution,
        knobs
    } = currentPreset;

    forEach(knobs, (knob, key) => {
        const {
            type,
            msb,
            lsb,
            minValue,
            channel,
            maxValue
        } = knob;

        const id = knob.hardwareId;
        const knobMessage = [type, id];

        switch (type) {
            // CC
            case 1:
                knobMessage.push(msb);
                knobMessage.push(highResolution ? msb + 32 : 0);
                knobMessage.push(0);
                knobMessage.push(minValue);
                knobMessage.push(maxValue);
                break;
            // CC & Channel
            case 2:
                knobMessage.push(msb);
                knobMessage.push(highResolution ? msb + 32 : 0);
                knobMessage.push(channel);
                knobMessage.push(minValue);
                knobMessage.push(maxValue);
                break;
            // NPRN
            case 3:
                knobMessage.push(msb);
                knobMessage.push(lsb);
                knobMessage.push(0);
                knobMessage.push(minValue);
                knobMessage.push(maxValue);
                break;
            // Disabled
            case 11:
                break;
            default:
                break;
        }

        messages.push(knobMessage);
    });

    messages.push([9, currentPreset.channel]);
    messages.push([14, currentPreset.highResolution]);
    messages.push([5, currentPreset.presetID]);

    return messages;
}

export function validateValueRange({ value, min, max }) {
    return Math.max(Number(min), Math.min(Number(max), Number(value)));
}