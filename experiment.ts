//% color="#7D2882" weight=4 icon="\uf0c3" block="CUHK-JC iCar Experiments"
//% groups='["iCar Food Delivery","iCar Moral Dilemma"]'

namespace CUHK_JC_iCar_Experiments {
    let Current_Location = 0
    let Pointing = 1
    let Target = 0
    let start = 0
    let forceLeft=0
    let forceRight_D = 0
    let forceRight_F = 0
    let forceStraight_C = 0
    let forceStraight_G = 0
    let tag: number[] = []
    export enum reason {
        //% block="Skill-based"
        //% block.loc.zh-tw="功能"
        //% block.loc.zh-cn="功能"
        skill = 1,
        //% block="Rule-based"
        //% block.loc.zh-tw="規則"
        //% block.loc.zh-cn="规则"
        rule = 2,
        //% block="Knowledge-based"
        //% block.loc.zh-tw="知識"
        //% block.loc.zh-cn="知识"
        knowledge = 3
    }
    export enum person {
        //% block="elderlies"
        //% block.loc.zh-tw="長者"
        //% block.loc.zh-cn="長者"
        elderlies = 1,
        //% block="kids"
        //% block.loc.zh-tw="小孩"
        //% block.loc.zh-cn="小孩"
        kids = 2,
    }

    export function sort(location: string[]): number[] {
        let tag_numbers: number[] = []
        if ((location.indexOf("A") != -1) || (location.indexOf("a") != -1)) { tag_numbers.push(1) }
        if ((location.indexOf("B") != -1) || (location.indexOf("b") != -1)) { tag_numbers.push(2) }
        if ((location.indexOf("C") != -1) || (location.indexOf("c") != -1)) { tag_numbers.push(3) }
        if ((location.indexOf("D") != -1) || (location.indexOf("d") != -1)) { tag_numbers.push(4) }
        if ((location.indexOf("E") != -1) || (location.indexOf("e") != -1)) { tag_numbers.push(5) }
        if ((location.indexOf("F") != -1) || (location.indexOf("f") != -1)) { tag_numbers.push(6) }
        if ((location.indexOf("G") != -1) || (location.indexOf("g") != -1)) { tag_numbers.push(7) }
        if ((location.indexOf("H") != -1) || (location.indexOf("h") != -1)) { tag_numbers.push(8) }
        return tag_numbers
    }

    export function search_to_Left_Right(target: number): number {
        if (target >= Pointing) {
            if (target - Pointing <= 4) return 1
            else return 2
        } else {
            if (target - Pointing <= -4) return 1
            else return 2
        }
    }
    function Search_Tag(tag: number, LeftRight: number, LSpeed: number, RSpeed: number, FSpeed: number) {
        if (LeftRight == 1) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinRight, RSpeed)
        } else {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinLeft, LSpeed)
        }
        huskylens.request()
        while (!(huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
            huskylens.request()
        }
        while (true) {
            huskylens.request()
            while (huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
                if (huskylens.readeBox(tag, Content1.xCenter) < 140) {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnLeft, LSpeed * 0.85)
                } else if (huskylens.readeBox(tag, Content1.xCenter) > 180) {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnRight, RSpeed * 0.85)
                } else {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed * 0.85)
                }
                huskylens.request()
            }
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed * 0.85)
            basic.pause(500)
            huskylens.request()
            if (!(huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
                break;
            }
        }
    }
    export function Line_Follow_Until_Tag(tag: number, LSpeed: number, RSpeed: number, FSpeed: number, straight: boolean) {
        huskylens.request()
        while (!(huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
            for (let index = 0; index < 5; index++) {
                Line_Following(LSpeed, RSpeed, FSpeed)
            }
            huskylens.request()
        }
        while (true) {
            while (huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
                for (let index = 0; index < 5; index++) {
                    Line_Following(LSpeed, RSpeed, FSpeed)
                }
                huskylens.request()
            }
            CUHK_JC_iCar.carStop()
            basic.pause(1000)
            huskylens.request()
            if (!(huskylens.isAppear(tag, HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
                break;
            }
        }

        Current_Location = tag
        if (straight == true) {
            CUHK_JC_iCar.setHeadColor(0x00ff00)
            forward_until_tag(tag, FSpeed)
            Turn_90_Deg(RSpeed)
        }
    }
    function forward_until_tag(tag: number, FSpeed: number) {
        huskylens.request()
        while (huskylens.readeBox(tag, Content1.yCenter) < 60) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
            huskylens.request()
        }
    }

    function home_calibration(LSpeed: number, RSpeed: number, FSpeed: number) {
        forward_until_tag(9, FSpeed)
        Search_Tag(9, 1, LSpeed, RSpeed, FSpeed)
    }

    function Turn_90_Deg(RSpeed: number) {
        while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine)) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinRight, RSpeed)
        }
        while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.WhiteLine)) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinRight, RSpeed)
        }
    }
    function Line_Following(LSpeed: number, RSpeed: number, FSpeed: number) {
        if (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.WhiteLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.WhiteLine)) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
        } else if (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.WhiteLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine)) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinRight, RSpeed)
        } else if (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.WhiteLine)) {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinLeft, LSpeed)
        } else {
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
        }
    }
    function Update_Pointing(): number {
        if (Current_Location + 4 > 8) { return (Current_Location + 4 - 8) }
        else return (Current_Location + 4)
    }
    function Complicated_Case() {
        if (tag.indexOf(1) != -1 && tag.indexOf(8) != -1 || tag.indexOf(1) != -1 && tag.indexOf(7) != -1 || tag.indexOf(2) != -1 && tag.indexOf(8) != -1) {
            for (let index = 0; index <= 8; index++) {
                if (tag.indexOf(8 - index) != -1 && tag.indexOf(7 - index) == -1 && tag.indexOf(6 - index) == -1) {
                    start = 8 - index
                    break;
                }
            }
            let temp: number[] = []
            for (let index = start; index <= 8; index++) {
                if (tag.indexOf(index) != -1) { temp.push(index) }
            }
            for (let index = 1; index < start; index++) {
                if (tag.indexOf(index) != -1) { temp.push(index) }
            }
            tag = temp
            temp = []
        }
        for (let value of [4, 6]) {
            if (tag.indexOf(value) != -1) {
                if(tag.indexOf(value - 1) != -1 || tag.indexOf(value - 2) != -1){
                    if(tag.indexOf(value + 1) == -1 && tag.indexOf(value + 2) == -1){
                        forceLeft = 1
                    } else {
                        if(value == 4){
                            forceRight_D = 1
                        } else {
                            forceRight_F = 1
                        }
                    }
                }
            }
        }
        for (let value of [3, 7]) {
            if (tag.indexOf(value) != -1) {
                if (tag.indexOf(value + 1) == -1 && tag.indexOf(value + 2) == -1 && (tag.indexOf(value - 1) != -1 || tag.indexOf(value - 2) != -1)) {
                    if (value == 3){
                        forceStraight_C = 1
                    } else {
                        forceStraight_G = 1
                    }
                }
            }
        }
    }
    function turn_to_tag(t: number, LSpeed: number, RSpeed: number, FSpeed: number, straight: boolean) {
        CUHK_JC_iCar.headLightsOff()
        Line_Follow_Until_Tag(t, LSpeed, RSpeed, FSpeed, false)
        if (tag.indexOf(t) != -1) {
            CUHK_JC_iCar.setHeadColor(0x00ff00)
            basic.pause(1000)
            tag.removeAt(tag.indexOf(t))
        }
        CUHK_JC_iCar.headLightsOff()
    }
    function blink() {
        for (let index = 0; index < 3; index++) {
            CUHK_JC_iCar.setHeadColor(0xff0000)
            basic.pause(200)
            CUHK_JC_iCar.setHeadColor(0x0000ff)
            basic.pause(200)
            CUHK_JC_iCar.setHeadColor(0x00ff00)
            basic.pause(200)
        }
    }
    function dummy_length(FSpeed: number){
        CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
        basic.pause(-30*FSpeed+1400)
    }
    /**
    * Save elderlies or kids in moral dilemma experiment
    */
    //% block="iCar save %index in moral dilemma experiment"
    //% block.loc.zh-tw="iCar進行道德困境實驗，保護 %index "
    //% block.loc.zh-cn="iCar进行道德困境实验，保护 %index "
    //% expandableArgumentMode="toggle"
    //% group="iCar Moral Dilemma" blockGap=10
    export function moralDilemma(index?: person): void {
        while (true) {
            if (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.WhiteLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.WhiteLine)) {
                CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, 40)
            } else if (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.WhiteLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine)) {
                CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinRight, 40)
            } else if (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.WhiteLine)) {
                CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinLeft, 40)
            } else if (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine)) {
                CUHK_JC_iCar.carStop()
                break;
            }
        }
        while (true) {
            huskylens.request()
            if (huskylens.isAppear(2, HUSKYLENSResultType_t.HUSKYLENSResultBlock) || huskylens.isAppear(3, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
                break;
            }
        }
        if (huskylens.isAppear(2, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
            basic.showNumber(2)
            if (index == 1) {
                CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnRight, 70)
            }
            else {
                CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnLeft, 70)
            }
            basic.pause(200)
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, 60)
            basic.pause(1000)
            CUHK_JC_iCar.carStop()
        } else if (huskylens.isAppear(3, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
            basic.showNumber(3)
            if (index == 2) {
                CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnRight, 70)
            }
            else {
                CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnLeft, 70)
            }
            basic.pause(200)
            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, 60)
            basic.pause(1000)
            CUHK_JC_iCar.carStop()
        }
    }
    /**
    * Initialize camera for moral dilemma experiment
    */
    //% block="iCar init moral dilemma"
    //% block.loc.zh-tw="iCar初始化道德困境實驗"
    //% block.loc.zh-cn="iCar初始化道德困境实验"
    //% group="iCar Moral Dilemma" blockGap=10
    export function initMoralDilemma(): void {
        huskylens.initI2c()
        huskylens.initMode(protocolAlgorithm.OBJECTCLASSIFICATION)
        basic.showIcon(IconNames.Happy)
    }
    /**
    * Sample points of delivering to A, B, F, G
    */
    //% block="Points A,B,F,G"
    //% block.loc.zh-tw="A,B,F,G"
    //% block.loc.zh-cn="A,B,F,G"
    //% group="iCar Food Delivery" blockGap=10
    export function ABFG(): string[] {
        return ["a", "b", "f", "g"]
    }
    /**
    * Move iCar to array of points(A to H) using SKill, Rule or Knowledge-bases reasoning, click "+" to customize speed values
    */
    //% block="iCar deliver food to $location using %index reasoning || at left speed %LSpeed\\%, right speed %RSpeed\\%, forward speed %FSpeed\\%"
    //% block.loc.zh-tw="iCar基於 %index 的推理，送遞外賣至 $location 點||，左速度為%LSpeed\\%，右速度為%RSpeed\\%，前行速度為%FSpeed\\%"
    //% block.loc.zh-cn="iCar基于 %index 的推理，送递外卖至 $location 点||，左速度为%LSpeed\\%，右速度为%RSpeed\\%，前行速度为%FSpeed\\%"
    //% LSpeed.min=1 LSpeed.max=100 LSpeed.defl=20
    //% RSpeed.min=1 RSpeed.max=100 RSpeed.defl=20
    //% FSpeed.min=1 FSpeed.max=100 FSpeed.defl=20
    //% inlineInputMode=inline
    //% expandableArgumentMode="toggle"
    //% group="iCar Food Delivery" blockGap=10
    export function startProgram(location: string[], index?: reason, LSpeed?: number, RSpeed?: number, FSpeed?: number): void {
        huskylens.initI2c()
        huskylens.initMode(protocolAlgorithm.ALGORITHM_TAG_RECOGNITION)
        tag = sort(location)
        if (index == 3) {
            while (tag.length != 0) {
                Complicated_Case()
                Target = tag.shift()
                Search_Tag(Target, search_to_Left_Right(Target), LSpeed, RSpeed, FSpeed)
                Line_Follow_Until_Tag(Target, LSpeed, RSpeed, FSpeed, true)
                CUHK_JC_iCar.headLightsOff()
                while (tag.length != 0) {
                    if (tag[0] - Target <= 2) {
                        Target = tag.shift()
                        if(Current_Location == 3 && Target == 5){
                            Line_Follow_Until_Tag(4, LSpeed, RSpeed, FSpeed, false)
                            while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.WhiteLine)) {
                                CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnRight, RSpeed)
                            }
                        }
                        if(Current_Location == 5 && Target == 7){
                            Line_Follow_Until_Tag(6, LSpeed, RSpeed, FSpeed, false)
                            while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.WhiteLine)) {
                                CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnRight, RSpeed)
                            }
                        }
                        Line_Follow_Until_Tag(Target, LSpeed, RSpeed, FSpeed, false)
                        CUHK_JC_iCar.setHeadColor(0x00ff00)
                        basic.pause(1000)
                        CUHK_JC_iCar.headLightsOff()
                    }
                    else { break }
                    if(forceRight_D == 1 && Current_Location == 4){
                        while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.WhiteLine)) {
                            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnRight, RSpeed)
                        }
                    }
                    if(forceRight_F == 1 && Current_Location == 6){
                        while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.WhiteLine)) {
                            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnRight, RSpeed)
                        }
                    }
                }
                while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine)) {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinLeft, LSpeed)
                }
                if(forceLeft == 1 && (Current_Location == 4 || Current_Location == 6)){
                    huskylens.request()
                    while (!(huskylens.isAppear(Current_Location, HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
                        CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnLeft, LSpeed)
                        huskylens.request()
                    }
                    dummy_length(FSpeed)
                }
                if(forceStraight_C == 1 && Current_Location == 3){
                    dummy_length(FSpeed)
                }
                if(forceStraight_G == 1 && Current_Location == 7){
                    dummy_length(FSpeed)
                }
                Turn_90_Deg(RSpeed)
                Turn_90_Deg(RSpeed)
                Line_Follow_Until_Tag(Target, LSpeed, RSpeed, FSpeed, false)
                home_calibration(LSpeed, RSpeed, FSpeed)
                while (!(CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine))) {
                    CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
                }
                CUHK_JC_iCar.carStop()
            }
        } else {
            Target = tag.shift()
            while (Target != 0) {
                if (index == 2) {
                    if (Target <= 3) {
                        Search_Tag(1, search_to_Left_Right(1), LSpeed, RSpeed, FSpeed)
                        Line_Follow_Until_Tag(1, LSpeed, RSpeed, FSpeed, false)
                        if (Target == 1) {
                            CUHK_JC_iCar.setHeadColor(0x00ff00)
                            basic.pause(1000)
                            if (tag.length != 0) { Target = tag.shift() } else { Target = 0 }
                        }
                        forward_until_tag(1, FSpeed)
                        Turn_90_Deg(RSpeed)
                        CUHK_JC_iCar.headLightsOff()
                        Line_Follow_Until_Tag(2, LSpeed, RSpeed, FSpeed, false)
                        if (Target == 2) {
                            CUHK_JC_iCar.setHeadColor(0x00ff00)
                            basic.pause(1000)
                            if (tag.length != 0) { Target = tag.shift() } else { Target = 0 }
                        }
                        CUHK_JC_iCar.headLightsOff()
                        Line_Follow_Until_Tag(3, LSpeed, RSpeed, FSpeed, false)
                        if (Target == 3) {
                            CUHK_JC_iCar.setHeadColor(0x00ff00)
                            basic.pause(1000)
                            if (tag.length != 0) { Target = tag.shift() } else { Target = 0 }
                        }
                        CUHK_JC_iCar.headLightsOff()
                        Pointing = 7
                        Current_Location = 3
                        dummy_length(FSpeed)
                        while (CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine)) {
                            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.SpinLeft, LSpeed)
                        }
                        Turn_90_Deg(RSpeed)
                        Turn_90_Deg(RSpeed)
                        Line_Follow_Until_Tag(3, LSpeed, RSpeed, FSpeed, false)
                        home_calibration(LSpeed, RSpeed, FSpeed)
                        while (!(CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine))) {
                            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
                        }
                        CUHK_JC_iCar.carStop()
                    }
                    if ((Target == 5) || (Target == 6)) {
                        Search_Tag(5, search_to_Left_Right(5), LSpeed, RSpeed, FSpeed)
                        Line_Follow_Until_Tag(5, LSpeed, RSpeed, FSpeed, false)
                        if (Target == 5) {
                            CUHK_JC_iCar.setHeadColor(0x00ff00)
                            basic.pause(1000)
                            if (tag.length != 0) { Target = tag.shift() } else { Target = 0 }

                        }
                        forward_until_tag(5, FSpeed)
                        Turn_90_Deg(RSpeed)
                        CUHK_JC_iCar.headLightsOff()
                        Line_Follow_Until_Tag(6, LSpeed, RSpeed, FSpeed, false)
                        if (Target == 6) {
                            CUHK_JC_iCar.setHeadColor(0x00ff00)
                            basic.pause(1000)
                            if (tag.length != 0) { Target = tag.shift() } else { Target = 0 }
                        }
                        CUHK_JC_iCar.headLightsOff()
                        Pointing = 2
                        Current_Location = 6
                        huskylens.request()
                        while (!(huskylens.isAppear(6, HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
                            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.TurnLeft, LSpeed)
                            huskylens.request()
                        }
                        dummy_length(FSpeed)
                        CUHK_JC_iCar.carStop()
                        Turn_90_Deg(RSpeed)
                        Turn_90_Deg(RSpeed)
                        Line_Follow_Until_Tag(6, LSpeed, RSpeed, FSpeed, false)
                        home_calibration(LSpeed, RSpeed, FSpeed)
                        while (!(CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine))) {
                            CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
                        }
                        CUHK_JC_iCar.carStop()
                    }
                }
                if (Target != 0) { 
                    Search_Tag(Target, search_to_Left_Right(Target), LSpeed, RSpeed, FSpeed)
                    Line_Follow_Until_Tag(Target, LSpeed, RSpeed, FSpeed, true)
                    Turn_90_Deg(RSpeed)
                    Pointing = Update_Pointing()
                    CUHK_JC_iCar.headLightsOff()
                    Line_Follow_Until_Tag(Target, LSpeed, RSpeed, FSpeed, false)
                    home_calibration(LSpeed, RSpeed, FSpeed)
                    while (!(CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Left, CUHK_JC_iCar.enLineState.BlackLine) && CUHK_JC_iCar.Line_Sensor(CUHK_JC_iCar.enPos.Right, CUHK_JC_iCar.enLineState.BlackLine))) {
                        CUHK_JC_iCar.carCtrlSpeed(CUHK_JC_iCar.CarState.Forward, FSpeed)
                    }
                    CUHK_JC_iCar.carStop()
                    if (tag.length != 0) { Target = tag.shift() } else { Target = 0 }
                }
            }
        }
        blink()
    }
}
