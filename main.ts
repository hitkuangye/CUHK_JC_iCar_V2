/*
Copyright (C): 2021-2030, The Chinese University of Hong Kong.
*/

//% color="#006400" weight=20 icon="\uf5e4"
//% groups='["Move","Head Lights","Breath Lights","Ultrasonic Sensor","Line Detector","Obstacle Sensor","Switch","Servomotor","Digital Read","Analog Read"]'
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

    export enum CarState {
        Forward,
        Backward,
        TurnLeft,
        TurnRight,
        Stop,
        SpinLeft,
        SpinRight
    }
    export enum singleWheel{
        Left,
        Right
    }
    export enum direction{
        Forward,
        Backward
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
    //% block="Car Stop"
    //% group="Move" blockGap=10
    export function carStop(){
      carCtrlSpeed(5,0)
    }
    
    //% block="Move|%singleWheel| motor |%direction| at speed %speed |\\%"
    //% speed.min=0 speed.max=100
    //% group="Move" blockGap=10
    export function singleTurn(singleWheel:singleWheel, direction: direction, speed: number): void {
        if (singleWheel==0 && direction == 0){
            carCtrlSpeed(3, speed)
        } else if (singleWheel==1 && direction == 0){
            carCtrlSpeed(2, speed)
        } else if (singleWheel==0 && direction == 1){
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
    //% block="Move|%index| at speed %speed |\\%"
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
    //% block="Set Head Lights to $color"
    //% color.shadow="colorNumberPicker"
    //% group="Head Lights" blockGap=10
    export function setHeadColor(color: number) {
        setPwm(0, 0, Math.round(((color >> 16) & 0xFF)*4095/255));
        setPwm(1, 0, Math.round(((color >> 8) & 0xFF)*4095/255));
        setPwm(2, 0, Math.round(((color) & 0xFF)*4095/255));
    }
    //% block="Turn Head Lights Off"
    //% group="Head Lights"
    export function headLightsOff() {
        setHeadColor(0)
    }
 /*****************************************************************************************************************************************
 *  Breath Lights *****************************************************************************************************************************
 ****************************************************************************************************************************************/
    //% block="Run Horse Light"
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
    //% block="Run Flow Light"
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
    
    //% block="Run Breath Light"
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
    
    //% block="Set Breath Lights to $color"
    //% color.shadow="colorNumberPicker"
    //% group="Breath Lights" blockGap=10
    export function setBreathColor(color: number) {
        RGB_Car_Program().showColor(neopixel.rgb(((color >> 16) & 0xFF),((color >> 8) & 0xFF),((color) & 0xFF)*4095/255))
    } 
    //% block="Turn Breath Lights Off"
    //% group="Breath Lights"
    export function breathLightsOff() {
        RGB_Car_Program().clear()
    }
 
 /*****************************************************************************************************************************************
 *  Ultrasonic Sensor *****************************************************************************************************************************
 ****************************************************************************************************************************************/
	//% block="ultrasonic return distance(cm)"
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
}
