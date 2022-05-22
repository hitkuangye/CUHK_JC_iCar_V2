/*
Copyright (C): 2021-2030, The Chinese University of Hong Kong.
*/


//% color="#022169" weight=20 icon="\uf1b9" block="CUHK-JC iCar"
//% groups='["Move","Headlights","RGB Module","Ultrasonic Sensor","Line Detector","Remote Control","Obstacle Sensor","Pins"]'

namespace CUHK_JC_iCar{ 
  //declare var remote : any;
  //let remote = remote.IrButtonHandler()
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
  let yahStrip: Strip;
  let pi12 = 0, pi13 = 0, pi14 = 0, pi15 = 0, spd = 0
  let irstate:number;
  let state:number;
  export enum CarState {
      //% block="Move Forward"
Forward,
//% block="Move Backward"
      Backward,
//% block="Turn Left"
      TurnLeft,
//% block="Turn Right"
      TurnRight,
//% block="Rotate Left"
      SpinLeft,
//% block="Rotate Right"
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
High,
Low
  }
  export enum enServo {
      J2 = 1,
      J3
  }
  export enum enAnalogPin {
      J2 = 1,
      J3,
P4,
P5
  }
  export enum enAvoidState {
      //% blockId="OBSTACLE" block="Blocked"
      OBSTACLE = 0,
      //% blockId="NOOBSTACLE" block="Unblocked"
      NOOBSTACLE = 1
  }
  export const enum IrButton {
  //% block="1"
  Number_1 = 0xA2,
  //% block="2"
  Number_2 = 0x62,
  //% block="3"
  Number_3 = 0xE2,
  //% block="4"
  Number_4 = 0x22,
  //% block="5"
  Number_5 = 0x02,
  //% block="6"
  Number_6 = 0xC2,
  //% block="7"
  Number_7 = 0xE0,
  //% block="8"
  Number_8 = 0xA8,
  //% block="9"
  Number_9 = 0x90,
  //% block="*"
  Star = 0x68,
  //% block="0"
  Number_0 = 0x98,
  //% block="#"
  Hash = 0xB0,
  //% block=" "
  Unused_4 = -4,
  //% block="▲"
  Up = 0x18,
  //% block=" "
  Unused_2 = -2,
  //% block="◀"
  Left = 0x10,
  //% block="OK"
  Ok = 0x38,
  //% block="▶"
  Right = 0x90,
  //% block=" "
  Unused_3 = -3,
  //% block="▼"
  Down = 0x4A,
  //% block="any"
  Any = -1,
}

export const enum IrButtonAction {
  //% block="Pressed"
  Pressed = 0,
  //% block="Released"
  Released = 1,
}

const enum IrProtocol {
  //% block="Keyestudio"
  Keyestudio = 0,
  //% block="NEC"
  NEC = 1,
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
  function RGB_Car_Program(): Strip {
      if (!yahStrip) {
          yahStrip = create(DigitalPin.P16, 3);
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
  
  //% block="iCar |%LRstate| motor move |%direction| at speed %speed |\\%"
  //% speed.min=0 speed.max=100 speed.defl=0
  //% group="Move" blockGap=10
  export function singleTurn(LRstate:LRstate, direction: direction, speed: number): void {
      if (LRstate==0 && direction == 0){
          carCtrlSpeed(3, speed)
      } else if (LRstate==1 && direction == 0){
          carCtrlSpeed(2, speed)
      } else if (LRstate==0 && direction == 1){
          setPwm(12, 0, 0);
          setPwm(13, 0, Math.round(pins.map(speed,0,100,350,4095)));
          setPwm(15, 0, 0);
          setPwm(14, 0, 0);           
      } else {
          setPwm(12, 0, 0);
          setPwm(13, 0, 0);
          setPwm(15, 0, Math.round(pins.map(speed,0,100,350,4095)));
          setPwm(14, 0, 0);   
      }
  }
  //% block="iCar |%index| at speed %speed |\\%"
  //% speed.min=1 speed.max=100 speed.defl=1
  //% group="Move" blockGap=10
  export function carCtrlSpeed(index: CarState, speed: number): void {
      spd = Math.round(pins.map(speed,0,100,350,4095))
      pi12 = (index == 0 || index == 3 || index == 5)? spd:0
      pi13 = (index == 1 || index == 4)? spd:0
      pi14 = (index == 1 || index == 5)? spd:0
      pi15 = (index == 0 || index == 2 || index == 4)? spd:0
      setPwm(12, 0, pi12);
      setPwm(13, 0, pi13);
      setPwm(14, 0, pi14);
      setPwm(15, 0, pi15);
  }

/*****************************************************************************************************************************************
*  Headlights *****************************************************************************************************************************
****************************************************************************************************************************************/
  //% block="iCar headlights turn OFF"
  //% group="Headlights" blockGap=10
  export function headLightsOff() {
      setHeadColor(0)
  }

  //% block="iCar headlights show $color"
  //% color.shadow="colorNumberPicker"
  //% group="Headlights" blockGap=10
  export function setHeadColor(color: number) {
      setPwm(0, 0, Math.round(((color >> 16) & 0xFF)*4095/255));
      setPwm(1, 0, Math.round(((color >> 8) & 0xFF)*4095/255));
      setPwm(2, 0, Math.round(((color) & 0xFF)*4095/255));
  }

/*****************************************************************************************************************************************
*  RGB Module *****************************************************************************************************************************
****************************************************************************************************************************************/
  //% shim=sendBufferAsm
  function sendBuffer(buf: Buffer, pin: DigitalPin) {
  }
  export class Strip {
      buf: Buffer;
      pin: DigitalPin;
      // TODO: encode as bytes instead of 32bit
      brightness: number;
      start: number; // start offset in LED strip
      _length: number; // number of LEDs
      _matrixWidth: number; // number of leds in a matrix - if any
      _matrixChain: number; // the connection type of matrix chain
      _matrixRotation: number; // the rotation type of matrix

      showColor(rgb: number) {
          rgb = rgb >> 0;
          this.setAllRGB(rgb);
          this.show();
      }
      show() {
          sendBuffer(this.buf, this.pin);
      }

      clear(): void {
          this.buf.fill(0, this.start * 3, this._length * 3);
      }

      setBrightness(brightness: number): void {
          this.brightness = brightness & 0xff;
      }

      setPin(pin: DigitalPin): void {
          this.pin = pin;
          pins.digitalWritePin(this.pin, 0);
          // don't yield to avoid races on initialization
      }
      private setBufferRGB(offset: number, red: number, green: number, blue: number): void {

          this.buf[offset + 0] = green;
          this.buf[offset + 1] = red;
          this.buf[offset + 2] = blue;
      }
      private setAllRGB(rgb: number) {
          let red = unpackR(rgb);
          let green = unpackG(rgb);
          let blue = unpackB(rgb);

          const br = this.brightness;
          if (br < 255) {
              red = (red * br) >> 8;
              green = (green * br) >> 8;
              blue = (blue * br) >> 8;
          }
          const end = this.start + this._length;
          for (let i = this.start; i < end; ++i) {
              this.setBufferRGB(i * 3, red, green, blue)
          }
      }
      private setPixelRGB(pixeloffset: number, rgb: number): void {
          if (pixeloffset < 0
              || pixeloffset >= this._length)
              return;

          pixeloffset = (pixeloffset + this.start) * 3;

          let red = unpackR(rgb);
          let green = unpackG(rgb);
          let blue = unpackB(rgb);

          let br = this.brightness;
          if (br < 255) {
              red = (red * br) >> 8;
              green = (green * br) >> 8;
              blue = (blue * br) >> 8;
          }
          this.setBufferRGB(pixeloffset, red, green, blue)
      }
  }

  export function create(pin: DigitalPin, numleds: number, ): Strip {
      let strip = new Strip();
      strip.buf = pins.createBuffer(numleds * 3);
      strip.start = 0;
      strip._length = numleds;
      strip._matrixWidth = 0;
      strip.setBrightness(255)
      strip.setPin(pin)
      return strip;
  }

  export function rgb(red: number, green: number, blue: number): number {
      return packRGB(red, green, blue);
  }

  function packRGB(a: number, b: number, c: number): number {
      return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
  }
  function unpackR(rgb: number): number {
      let r = (rgb >> 16) & 0xFF;
      return r;
  }
  function unpackG(rgb: number): number {
      let g = (rgb >> 8) & 0xFF;
      return g;
  }
  function unpackB(rgb: number): number {
      let b = (rgb) & 0xFF;
      return b;
  }
 
  //% block="iCar RGB module turn OFF"
  //% group="RGB Module" blockGap=10
  export function breathLightsOff() {
      RGB_Car_Program().showColor(rgb(0,0,0))
  }	


  //% block="iCar RGB module show Marquee"
  //% group="RGB Module" blockGap=10
  export function runHorseLight() { 
      for (let index = 0; index < 3; index++) {
          RGB_Car_Program().showColor(rgb(((0xFF0000 >> 16) & 0xFF),0,0))
          basic.pause(200)
          RGB_Car_Program().showColor(rgb(0,((0x00FF00 >> 8) & 0xFF),0))
          basic.pause(200)
          RGB_Car_Program().showColor(rgb(0,0,(0x0000FF & 0xFF) * 4095 / 255))
          basic.pause(200)
      }
  }
  //% block="iCar RGB module show Flowing"
  //% group="RGB Module" blockGap=10
  export function runFlowLight() {
      for (let index = 0; index < 3; index++) {
          for (let index = 0; index <= 2; index++) {
              RGB_Car_Program().clear()
              RGB_Car_Program().showColor(rgb(0,((0x00FF00 >> 8) & 0xFF),0))
              basic.pause(200)
          }
      }
  }
  
  //% block="iCar RGB module show Breathing"
  //% group="RGB Module" blockGap=10
  export function runBreathLight() {
      for (let index = 0; index <= 13; index++) {
          RGB_Car_Program().showColor(rgb(0, index * 19, 0))
          basic.pause(100)
      }
      for (let index = 0; index <= 13; index++) {
          RGB_Car_Program().showColor(rgb(0, 247 - index * 19, 0))
          basic.pause(100)
      }
  }
  
  //% block="iCar RGB module show $color"
  //% color.shadow="colorNumberPicker"
  //% group="RGB Module" blockGap=10
  export function setBreathColor(color: number) {
      RGB_Car_Program().showColor(rgb(((color >> 16) & 0xFF),((color >> 8) & 0xFF),((color) & 0xFF)*4095/255))
    
  } 


/*****************************************************************************************************************************************
*  Ultrasonic Sensor *****************************************************************************************************************************
****************************************************************************************************************************************/
  //% block="iCar ultrasonic sensor get distance(cm)"
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
  //% block="is |%direct|iCar line detector %value ?"
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
   //% block="when iCar remote control button | %button | is %action"
   //% button.fieldEditor="gridpicker"
   //% button.fieldOptions.columns=3
   //% button.fieldOptions.tooltips="false"
   //% group="Remote Cntrol" blockGap=10
   export function buttonChoice(button: IrButton, action: IrButtonAction, handler: () => void) {
     makerbit.onIrButton(button, action)
   }  

   //% block="iCar remote control receiver turn ON"
   //% group="Remote Cntrol" blockGap=10
   export function connectRemote(): void {
      makerbit.connectIrReceiver(DigitalPin.P8, 0)
   }
/*****************************************************************************************************************************************
*  Obstacle Sensor *****************************************************************************************************************************
****************************************************************************************************************************************/    	    
  //% block="is iCar obstacle sensor |%value ?"
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
  }


/*****************************************************************************************************************************************
* Servo *****************************************************************************************************************************
****************************************************************************************************************************************/   	 
  //% block="iCar analog write pin | %num| to %value "
  //% group="Pins" blockGap=10
  //% value.min=0 value.max=1023
  export function analogPinWrite(num: enAnalogPin, value: number): void {
if (num<=2){
  setPwm(num + 3, 0, Math.round(pins.map(value,0,1023,0,4096)));
} else if (num == 3){
  pins.analogWritePin(AnalogPin.P4, value)
}
  else {
    pins.analogWritePin(AnalogPin.P5, value)
  }
  }	


  //% block="iCar servomotor pin | %num| turn OFF"
  //% group="Pins" blockGap=10
  //% num.min=1 num.max=2 
  export function servoStop(num: enServo): void {
      setPwm(num + 3, 0, 0);
  }	

  //% block="iCar servomotor write pin | %num| to %value degree"
  //% group="Pins" blockGap=10
  //% num.min=1 num.max=2 value.min=0 value.max=180
  export function servoAngle(num: enServo, value: number): void {
      // 50hz: 20,000 us
      let us = (value * 1800 / 180 + 600); // 0.6 ~ 2.4
      let pwm = us * 4096 / 20000;
      setPwm(num + 3, 0, pwm);
  }	
/*****************************************************************************************************************************************
* Digital Write *****************************************************************************************************************************
****************************************************************************************************************************************/   	    
  //% block="iCar digital write pin |%pinNumber| to |%onOffState|"
  //% group="Pins" blockGap=10
  export function digitalWrite(pinNumber: pinNumber, onOffState: onOffState): void {
  if (pinNumber == 0){
     led.enable(false)
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
  }
/*****************************************************************************************************************************************
* digital read *****************************************************************************************************************************
****************************************************************************************************************************************/   
  //% block="iCar digital read pin |%pinNumber| "
  //% group="Pins" blockGap=10
  export function digitalRead(pinNumber: pinNumber): number {
      if (pinNumber == 0) {
  return(pins.digitalReadPin(DigitalPin.P4))
} else {
  return(pins.digitalReadPin(DigitalPin.P5))
}
  }
}
