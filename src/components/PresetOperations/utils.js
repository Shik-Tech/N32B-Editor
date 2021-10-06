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
            channel
        } = knob;

        const id = knob.hardwareId;
        const knobMessage = [type, id];

        switch (type) {
            // CC
            case 1:
                knobMessage.push(msb);
                knobMessage.push(highResolution ? msb + 32 : 0);
                knobMessage.push(0);
                break;
            // CC & Channel
            case 2:
                knobMessage.push(msb);
                knobMessage.push(highResolution ? msb + 32 : 0);
                knobMessage.push(channel);
                break;
            // NPRN
            case 3:
                knobMessage.push(msb);
                knobMessage.push(lsb);
                knobMessage.push(0);
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

export function generateSysExFromPreset_MK2(currentPreset) {
    const messages = [];
    const {
        knobs
    } = currentPreset;

    forEach(knobs, (knobPair, key) => {
        forEach(knobPair.data, (knob, pairKey) => {
            const {
                data,
                channel,
                type,
                invert,
            } = knob;
            
            const id = key;
            // console.log(pairKey);
            const knobMessage = [type, id];
       
            switch (type) {
                // CC
                case 1:
                    knobMessage.push(data);
                    knobMessage.push(0);
                    break;
                // CC & Channel
                case 2:
                    knobMessage.push(data);
                    knobMessage.push(channel);
                    break;
                // NPRN
                // case 3:
                //     knobMessage.push(msb);
                //     knobMessage.push(lsb);
                //     knobMessage.push(0);
                //     break;
                // Disabled
                case 11:
                    break;
                default:
                    break;
            }
    
            messages.push(knobMessage);
        });
    });

    messages.push([5, currentPreset.presetID]);

    return messages;
}

export function validateValueRange({ value, min, max }) {
    return Math.max(Number(min), Math.min(Number(max), Number(value)));
}