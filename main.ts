/*
Copyright (C): 2021-2030, The Chinese University of Hong Kong.
*/

//% color="#006400" weight=20 icon="\uf5e4"
//% groups='["Move","Head Lights","Breath Lights","Ultrasonic Sensor","Line Detector","Remote Control","Obstacle Sensor","Switch","Servomotor","Digital Sensor","Analog Sensor"]'
namespace CUHK_JC_iCar {
    const PCA9685_ADD = 0x41
    const MODE1 = 0x00
    const MODE2 = 0x01
    const SUBADR1 = 0x02
    const SUBADR2 = 0x03
    const SUBADR3 = 0x04

    const LED0_ON_L = 0x06
    const LED0_ON_H = 0x07
    const LED0_OFF_L = 0x08
    const LED0_OFF_H = 0x09

    const ALL_LED_ON_L = 0xFA
    const ALL_LED_ON_H = 0xFB
    const ALL_LED_OFF_L = 0xFC
    const ALL_LED_OFF_H = 0xFD

    const PRESCALE = 0xFE

    let initialized = false
    let yahStrip: neopixel.Strip;
    let pi12 = 0, pi13 = 0, pi14 = 0, pi15 = 0, spd = 0
    let irstate:number;
    let state:number;
    export enum CarState {
        Forward,
        Backward,
        TurnLeft,
        TurnRight,
        Stop,
        SpinLeft,
        SpinRight
    }
    export enum LRstate{
        Left,
        Right
    }
    export enum direction{
        Forward,
        Backward
    }
    export enum enPos {
        Left,
        Right
    }
    export enum enLineState {
        WhiteLine,
        BlackLine
    }
    export enum pinNumber {
	P4,
	P5
    }
    export enum onOffState {
	on,
	off
    }
    export enum enServo {
        J1 = 1,
        J2
    }
   /* export enum enIRButton {
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
    }*/
    export enum enAvoidState {
        //% blockId="OBSTACLE" block="Blocked"
        OBSTACLE = 0,
        //% blockId="NOOBSTACLE" block="Unblocked"
        NOOBSTACLE = 1
    }
    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADD, MODE1, 0x00)
        setFreq(50);
        initialized = true
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADD, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite(PCA9685_ADD, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADD, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADD, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADD, MODE1, oldmode | 0xa1);
    }
    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;
        if (!initialized) {
            initPCA9685();
        }
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADD, buf);
    }
    function RGB_Car_Program(): neopixel.Strip {
        if (!yahStrip) {
            yahStrip = neopixel.create(DigitalPin.P16, 3, NeoPixelMode.RGB);
        }
        return yahStrip;  
    }
    
 /*****************************************************************************************************************************************
 *  MOVE *****************************************************************************************************************************
 ****************************************************************************************************************************************/
    //% block="iCar Stop"
    //% group="Move" blockGap=10
    export function carStop(){
      carCtrlSpeed(5,0)
    }
    
    //% block="iCar Move|%LRstate| motor |%direction| at speed %speed |\\%"
    //% speed.min=0 speed.max=100
    //% group="Move" blockGap=10
    export function singleTurn(LRstate:LRstate, direction: direction, speed: number): void {
        if (LRstate==0 && direction == 0){
            carCtrlSpeed(3, speed)
        } else if (LRstate==1 && direction == 0){
            carCtrlSpeed(2, speed)
        } else if (LRstate==0 && direction == 1){
            setPwm(12, 0, 0);
            setPwm(13, 0, Math.round(pins.map(speed,0,100,350,4096)));
            setPwm(15, 0, 0);
            setPwm(14, 0, 0);           
        } else {
            setPwm(12, 0, 0);
            setPwm(13, 0, 0);
            setPwm(15, 0, Math.round(pins.map(speed,0,100,350,4096)));
            setPwm(14, 0, 0);   
        }
    }
    //% block="iCar Move|%index| at speed %speed |\\%"
    //% speed.min=0 speed.max=100
    //% group="Move" blockGap=10
    export function carCtrlSpeed(index: CarState, speed: number): void {
        spd = Math.round(pins.map(speed,0,100,350,4096))
        pi12 = 0
        pi13 = 0
        pi14 = 0
        pi15 = 0
        if (index == 0 || index == 3 || index == 6){
            pi12 = spd
        }
        if (index == 0 || index == 2 || index == 5){
            pi15 = spd
        }
        if (index == 1 || index == 5){
            pi13 = spd
        }        
        if (index == 1 || index == 6){
            pi14 = spd
        }   
        setPwm(12, 0, pi12);
        setPwm(13, 0, pi13);
        setPwm(15, 0, pi14);
        setPwm(14, 0, pi15);
    }
  
 /*****************************************************************************************************************************************
 *  Head Lights *****************************************************************************************************************************
 ****************************************************************************************************************************************/
    //% block="Head Lights turn $color"
    //% color.shadow="colorNumberPicker"
    //% group="Head Lights" blockGap=10
    export function setHeadColor(color: number) {
        setPwm(0, 0, Math.round(((color >> 16) & 0xFF)*4095/255));
        setPwm(1, 0, Math.round(((color >> 8) & 0xFF)*4095/255));
        setPwm(2, 0, Math.round(((color) & 0xFF)*4095/255));
    }
    //% block="Head Lights turn Off"
    //% group="Head Lights" blockGap=10
    export function headLightsOff() {
        setHeadColor(0)
    }
 /*****************************************************************************************************************************************
 *  Breath Lights *****************************************************************************************************************************
 ****************************************************************************************************************************************/
    //% block="Horse Light effect on"
    //% group="Breath Lights" blockGap=10
    export function runHorseLight() { 
        for (let index = 0; index < 3; index++) {
            RGB_Car_Program().clear()
            RGB_Car_Program().setPixelColor(0, neopixel.colors(NeoPixelColors.Red))
            basic.pause(200)
            RGB_Car_Program().clear()
            RGB_Car_Program().setPixelColor(1, neopixel.colors(NeoPixelColors.Blue))
            basic.pause(200)
            RGB_Car_Program().clear()
            RGB_Car_Program().setPixelColor(3, neopixel.colors(NeoPixelColors.Green))
            basic.pause(200)
        }
    }
    //% block="Flow Light effect on"
    //% group="Breath Lights" blockGap=10
    export function runFlowLight() {
        for (let index = 0; index < 3; index++) {
            for (let index = 0; index <= 2; index++) {
                RGB_Car_Program().clear()
                RGB_Car_Program().setPixelColor(index, neopixel.colors(NeoPixelColors.Green))
                basic.pause(200)
            }
        }
    }
    
    //% block="Breath light effect on"
    //% group="Breath Lights" blockGap=10
    export function runBreathLight() {
        for (let index = 0; index <= 13; index++) {
            RGB_Car_Program().showColor(neopixel.rgb(0, index * 19, 0))
            basic.pause(100)
        }
        for (let index = 0; index <= 13; index++) {
            RGB_Car_Program().showColor(neopixel.rgb(0, 247 - index * 19, 0))
            basic.pause(100)
        }
    }
    
    //% block="Breath lights turn $color"
    //% color.shadow="colorNumberPicker"
    //% group="Breath Lights" blockGap=10
    export function setBreathColor(color: number) {
        RGB_Car_Program().showColor(neopixel.rgb(((color >> 16) & 0xFF),((color >> 8) & 0xFF),((color) & 0xFF)*4095/255))
    } 
    //% block="Breath lights turn Off"
    //% group="Breath Lights" blockGap=10
    export function breathLightsOff() {
        RGB_Car_Program().clear()
    }
 
 /*****************************************************************************************************************************************
 *  Ultrasonic Sensor *****************************************************************************************************************************
 ****************************************************************************************************************************************/
    //% block="ultrasonic sensor returns distance(cm)"
    //% group="Ultrasonic Sensor" blockGap=10
    export function Ultrasonic_Car(): number {
        let d = 0
        // send pulse   
        let list:Array<number> = [0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
		        pins.digitalWritePin(DigitalPin.P14, 0);
		        control.waitMicros(2);
		        pins.digitalWritePin(DigitalPin.P14, 1);
		        control.waitMicros(15);
		        pins.digitalWritePin(DigitalPin.P14, 0);
		        d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 43200);
		        list[i] = Math.floor(d / 40)
        }
        list.sort();
        return  Math.floor((list[1] + list[2] + list[3])/3);
    }
 /*****************************************************************************************************************************************
 *  Line Detector *****************************************************************************************************************************
 ****************************************************************************************************************************************/
    //% block="Is line detector|direct %direct|value %value ?"
    //% group="Line Detector" blockGap=10
    export function Line_Sensor(direct: enPos, value: enLineState): boolean {
        let temp: boolean = false;
        switch (direct) {
            case enPos.Left: {
                if (pins.analogReadPin(AnalogPin.P2) < 500) {
                    if (value == enLineState.WhiteLine) {
                        temp = true;
                    }
                    setPwm(7, 0, 4095);
                }
                else {
                    if (value == enLineState.BlackLine) {
                        temp = true;
                    }
                    setPwm(7, 0, 0);
                }
                break;
            }

            case enPos.Right: {
                if (pins.analogReadPin(AnalogPin.P1) < 500) {
                    if (value == enLineState.WhiteLine) {
                        temp = true;
                    }
                    setPwm(6, 0, 4095);
                }
                else {
                    if (value == enLineState.BlackLine) {
                        temp = true;
                    }
                    setPwm(6, 0, 0);
                }
                break;
            }
        }
        return temp;
	}	 
 /*****************************************************************************************************************************************
 *  Remote Control *****************************************************************************************************************************
 ****************************************************************************************************************************************/
  /*  //% advanced=true shim=Bit_IR::irCode
    function irCode(): number {
        return 0;
    }
	    
    //% block="Remote control value |value %value"
    //%group="Remote Control" blockGap=10
    export function IR_KeyValue(value: enIRButton): number {
        return value;
    }

    //% block="Remote control returns read value"
    //%group="Remote Control" blockGap=10
    export function IR_readV2(): number {
        return valuotokeyConversion();
    }

    //% block="When receive remote signal"
    //%group="Remote Control" blockGap=10
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
    })*/
 /*****************************************************************************************************************************************
 *  Obstacle Sensor *****************************************************************************************************************************
 ****************************************************************************************************************************************/    	    
   /* //% block="Is obstacle sensor |value %value ?"
    //% group="Obstacle Sensor" blockGap=10
    export function Avoid_Sensor(value: enAvoidState): boolean {
        let temp: boolean = false;
        pins.setPull(DigitalPin.P9, PinPullMode.PullUp)
        pins.digitalWritePin(DigitalPin.P9, 0);
        control.waitMicros(100);
        switch (value) {
            case enAvoidState.OBSTACLE: {
                serial.writeNumber(pins.analogReadPin(AnalogPin.P3))
                if (pins.analogReadPin(AnalogPin.P3) < 800) {
                
                    temp = true;
                    setPwm(8, 0, 0);
                }
                else {                 
                    temp = false;
                    setPwm(8, 0, 4095);
                }
                break;
            }

            case enAvoidState.NOOBSTACLE: {
                if (pins.analogReadPin(AnalogPin.P3) > 800) {

                    temp = true;
                    setPwm(8, 0, 4095);
                }
                else {
                    temp = false;
                    setPwm(8, 0, 0);
                }
                break;
            }
        }
        pins.digitalWritePin(DigitalPin.P9, 1);
        return temp;
    }*/
 /*****************************************************************************************************************************************
 * Digital Sensor *****************************************************************************************************************************
 ****************************************************************************************************************************************/   
  /*  //% block="Pin |%pinNumber| returns digital reading"
    //% group="Digital Sensor" blockGap=10
    export function digitalRead(pinNumber: pinNumber): number {
        if (pinNumber == 0) {
		return(pins.digitalReadPin(DigitalPin.P4))
	} else {
		return(pins.digitalReadPin(DigitalPin.P5))
	}
    }*/
 /*****************************************************************************************************************************************
 * Analog Sensor *****************************************************************************************************************************
 ****************************************************************************************************************************************/   
   /* //% block="Pin |%pinNumber| returns analog reading"
    //% group="Analog Sensor" blockGap=10
    export function analogRead(pinNumber: pinNumber): number {
        if (pinNumber == 0) {
		return(pins.analogReadPin(AnalogPin.P4))
	} else {
		return(pins.analogReadPin(AnalogPin.P5))
	}
    }	*/
 /*****************************************************************************************************************************************
 * Digital Write *****************************************************************************************************************************
 ****************************************************************************************************************************************/   	    
   /* //% block="Pin |%pinNumber| device turns |%onOffState|"
    //% group="Switch" blockGap=10
    export function digitalWrite(pinNumber: pinNumber, onOffState: onOffState): void {
	if (pinNumber == 0){
		if (onOffState == 0){
			pins.digitalWritePin(DigitalPin.P4, 1)
		} else {
			pins.digitalWritePin(DigitalPin.P4, 0)
		}
	} else if(onOffState == 0){
		pins.digitalWritePin(DigitalPin.P5, 1)
	} else {
		pins.digitalWritePin(DigitalPin.P5, 0)
	}
    }*/
 /*****************************************************************************************************************************************
 * Servo *****************************************************************************************************************************
 ****************************************************************************************************************************************/   	   	    
   /* //% block="Servo |num %num| turns to %value degrees"
    //% group="Servomotor" blockGap=10
    //% num.min=1 num.max=2 value.min=0 value.max=180
    export function servoAngle(num: enServo, value: number): void {
        // 50hz: 20,000 us
        let us = (value * 1800 / 180 + 600); // 0.6 ~ 2.4
        let pwm = us * 4096 / 20000;
        setPwm(num + 2, 0, pwm);
    }	
    //% block="Servo |num %num| disable"
    //% group="Servomotor" blockGap=10
    //% num.min=1 num.max=2 
    export function servoStop(num: enServo): void {
        setPwm(num + 2, 0, 0);
    }	 */ 

}
