

//% weight=10 color=#008B00 icon="\uf1eb" block="CUHK_JC_iCar_IR"
namespace BitIR {
    


    let irstate:number;
    let state:number;
    
    export enum enIRButton {

        //% blockId="Up" block="Up"
        Up = 0x00,
        //% blockId="Light" block="Star"
        Light = 0x01,
        //% blockId="Left" block="Left"
        Left = 0x02,
        //% blockId="Beep" block="Pound"
        Beep = 0x04,
        //% blockId="Right" block="Right"
        Right = 0x05,
        //% blockId="SpinLeft" block="Ok"
        SpinLeft = 0x06,
        //% blockId="Down" block="Down"
        Down = 0x08,
        //% blockId="Zero" block="Zero"
        Zero = 0x09,
        //% blockId="One" block="One"
        One = 0x0a,
        //% blockId="Two" block="Two"
        Two = 0x0c,
        //% blockId="Three" block="Three"
        Three = 0x0d,
        //% blockId="Four" block="Four"
        Four = 0x0e,
        //% blockId="Five" block="Five"
        Five = 0x10,
        //% blockId="Six" block="Six"
        Six = 0x11,
        //% blockId="Seven" block="Seven"
        Seven = 0x12,
        //% blockId="Eight" block="Eight"
        Eight = 0x14,
        //% blockId="Nine" block="Nine"
        Nine = 0x15,

    }



     /**
     * Read IR sensor value V2.
     */

    //% advanced=true shim=Bit_IR::irCode
    function irCode(): number {
        return 0;
    }

    //% weight=5
    //% blockId=IR_KeyValue block="IR_KeyValue|value %value"
    export function IR_KeyValue(value: enIRButton): number {
        return value;
    }

    
    //% weight=5
    //% blockId=IR_readV2 block="read IR key value"
    export function IR_readV2(): number {
        return valuotokeyConversion();
    }

    //% weight=2
    //% blockId=IR_callbackUserV2 block="on IR received"
    //% draggableParameters
    export function IR_callbackUserV2(cb: (message: number) => void) {
        state = 1;
        control.onEvent(11, 22, function() {
            cb(irstate);
        }) 
    }

    function valuotokeyConversion():number{
        let irdata:number;
        switch(irCode()){
            case 0xE718:irdata = 0;break;
            case 0xE916:irdata = 1;break;
            case 0xF708:irdata = 2;break;
            case 0xF20D:irdata = 4;break;
            case 0xA55A:irdata = 5;break;
            case 0xE31C:irdata = 6;break;
            case 0xAD52:irdata = 8;break;
            case 0xE619:irdata = 9;break;
            case 0xBA45:irdata = 10;break;
            case 0xB946:irdata = 12;break;
            case 0xB847:irdata = 13;break;
            case 0xBB44:irdata = 14;break;
            case 0xBF40:irdata = 16;break;
            case 0xBC43:irdata = 17;break;
            case 0xF807:irdata = 18;break;
            case 0xEA15:irdata = 20;break;
            case 0xF609:irdata = 21;break;
            default:
             irdata = -1;
        }
        return irdata;
    }

    basic.forever(() => {
        if(state == 1){
            irstate = valuotokeyConversion();
            if(irstate != -1){
                control.raiseEvent(11, 22);
            }
        }
        
        basic.pause(20);
    })

}
