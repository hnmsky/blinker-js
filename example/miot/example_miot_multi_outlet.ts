import { BlinkerDevice } from '../../lib/blinker';
import { Miot, VA_TYPE } from '../../lib/voice-assistant';
import { exec } from 'child_process'

let device = new BlinkerDevice('key ID');

let miot = device.addVoiceAssistant(new Miot(VA_TYPE.MULTI_OUTLET));

device.ready().then(() => {
    // 电源状态改变
    miot.powerChange.subscribe(message => {
        // console.log(message.data);
        if (typeof message.data.set.num != 'undefined') {
            message.num(message.data.set.num)
        }
        switch (message.data.set.pState) {
            case 'true':
                message.power('on', message.data.messageId).update();
                powerOn(message.data.set.num)
                break;
            case 'false':
                message.power('off', message.data.messageId).update();
                break;
            default:
                break;
        }
    })
    miot.stateQuery.subscribe(message => {
        message.power('on').update();
        //console.log('stateQuery:', message.data);
   })  
    device.dataRead.subscribe(message => {
        console.log('otherData:', message);
    })

    device.builtinSwitch.change.subscribe(message => {
        console.log('builtinSwitch:', message);
        device.builtinSwitch.setState(turnSwitch()).update();
    })

})


/*
以下为测试用函数
*/

function rgb2int(r: number, g: number, b: number) {
    return ((0xFF << 24) | (r << 16) | (g << 8) | b)
}

function int2rgb(value: number) {
    let r = (value & 0xff0000) >> 16;
    let g = (value & 0xff00) >> 8;
    let b = (value & 0xff);
    return [r, g, b]
}

let switchState = false
function turnSwitch() {
    switchState = !switchState
    device.log("切换设备状态为" + (switchState ? 'on' : 'off'))
    return switchState ? 'on' : 'off'
}
function powerOn(num:string) {
    switchState = true
    console.log('power on:'+num);
    exec('bash ./poweron.sh '+ num, (err, stdout, stdrr) => {
        console.log(stdout)
      });
    return switchState ? 'on' : 'off'
}
