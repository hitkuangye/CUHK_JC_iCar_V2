/** 
 * @file pxt-DFRobot_HuskyLens/huskylens.ts
 * @brief DFRobot's huskylens makecode library.
 * @n [Get the module here](https://github.com/DFRobot/pxt-DFRobot_HaskyLens)
 * @n HuskyLens is an easy-to-use AI vision sensor with six built-in functions: face recognition, object tracking, object recognition, line tracking, color recognition, and label (qr code) recognition. 
 * Only one button is needed to complete the AI training, which can get rid of tedious training and complicated visual algorithm and help users stay focused on the conception and implementation of the project.
 * 
 * @copyright    [DFRobot](http://www.dfrobot.com), 2016
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](jie.tang@dfrobot.com)
 * @date  2020-3-17
*/
enum Content1 {
    //% block="X center"
    //% block.loc.zh-tw="X中心"
    //% block.loc.zh-cn="X中心"
    xCenter = 1,
    //% block="Y center"
    //% block.loc.zh-tw="Y中心"
    //% block.loc.zh-cn="Y中心"
    yCenter = 2,
    //% block="width"
    //% block.loc.zh-tw="寬度"
    //% block.loc.zh-cn="宽度"
    width = 3,
    //% block="height"
    //% block.loc.zh-tw="高度"
    //% block.loc.zh-cn="高度"
    height = 4
}

enum Content2 {
    //% block="X beginning"
    //% block.loc.zh-tw="X起點"
    //% block.loc.zh-cn="X起点"
    xOrigin = 1,
    //% block="Y beginning"
    //% block.loc.zh-tw="Y起點"
    //% block.loc.zh-cn="Y起点"
    yOrigin = 2,
    //% block="X endpoint"
    //% block.loc.zh-tw="X終點"
    //% block.loc.zh-cn="X终点"
    xTarget = 3,
    //% block="Y endpoint"
    //% block.loc.zh-tw="Y終點"
    //% block.loc.zh-cn="Y终点"
    yTarget = 4
}

enum Content3 {
    //% block="ID"
    ID = 5,
    //% block="X center"
    //% block.loc.zh-tw="X中心"
    //% block.loc.zh-cn="X中心"
    xCenter = 1,
    //% block="Y center"
    //% block.loc.zh-tw="Y中心"
    //% block.loc.zh-cn="Y中心"
    yCenter = 2,
    //% block="width"
    //% block.loc.zh-tw="寬度"
    //% block.loc.zh-cn="宽度"
    width = 3,
    //% block="height"
    //% block.loc.zh-tw="高度"
    //% block.loc.zh-cn="高度"
    height = 4
}

enum Content4 {
    //% block="ID"
    ID = 5,
    //% block="X beginning"
    //% block.loc.zh-tw="X起點"
    //% block.loc.zh-cn="X起点"
    xOrigin = 1,
    //% block="Y beginning"
    //% block.loc.zh-tw="Y起點"
    //% block.loc.zh-cn="Y起点"
    yOrigin = 2,
    //% block="X endpoint"
    //% block.loc.zh-tw="X終點"
    //% block.loc.zh-cn="X终点"
    xTarget = 3,
    //% block="Y endpoint"
    //% block.loc.zh-tw="Y終點"
    //% block.loc.zh-cn="Y终点"
    yTarget = 4

}

enum HUSKYLENSResultType_t {
    //%block="frame"
    //% block.loc.zh-tw="方框"
    //% block.loc.zh-cn="方框"
    HUSKYLENSResultBlock = 1,
    //%block="arrow"
    //% block.loc.zh-tw="箭頭"
    //% block.loc.zh-cn="箭头"
    HUSKYLENSResultArrow = 2,
}

let FIRST = {
        first: -1,
        xCenter: -1,
        xOrigin: -1,
        protocolSize: -1,
        algorithmType: -1,
        requestID: -1,
    };

enum HUSKYLENSMode{
    //%block="save"
    //% block.loc.zh-tw="保存"
    //% block.loc.zh-cn="保存"
    SAVE,
    //%block="load"
    //% block.loc.zh-tw="加載"
    //% block.loc.zh-cn="加载"
    LOAD,
}
enum HUSKYLENSphoto{
    //%block="photo"
    //% block.loc.zh-tw="拍照"
    //% block.loc.zh-cn="拍照"
    PHOTO,
    //%block="screenshot"
    //% block.loc.zh-tw="截圖"
    //% block.loc.zh-cn="截图"
    SCREENSHOT
}
enum protocolCommand {
    COMMAND_REQUEST = 0x20,
    COMMAND_REQUEST_BLOCKS = 0x21,
    COMMAND_REQUEST_ARROWS = 0x22,
    COMMAND_REQUEST_LEARNED = 0x23,
    COMMAND_REQUEST_BLOCKS_LEARNED = 0x24,
    COMMAND_REQUEST_ARROWS_LEARNED = 0x25,
    COMMAND_REQUEST_BY_ID = 0x26,
    COMMAND_REQUEST_BLOCKS_BY_ID = 0x27,
    COMMAND_REQUEST_ARROWS_BY_ID = 0x28,
    COMMAND_RETURN_INFO = 0x29,
    COMMAND_RETURN_BLOCK = 0x2A,
    COMMAND_RETURN_ARROW = 0x2B,
    COMMAND_REQUEST_KNOCK = 0x2C,
    COMMAND_REQUEST_ALGORITHM = 0x2D,
    COMMAND_RETURN_OK = 0x2E,
    COMMAND_REQUEST_LEARN = 0x2F,
    COMMAND_REQUEST_FORGET = 0x30,
    COMMAND_REQUEST_SENSOR = 0x31,

}

enum protocolAlgorithm {
    //%block="Face Recognition"
    //% block.loc.zh-tw="人臉辨識"
    //% block.loc.zh-cn="人脸辨识"
    ALGORITHM_FACE_RECOGNITION = 0,
    //%block="Object Tracking"
    //% block.loc.zh-tw="物體追蹤"
    //% block.loc.zh-cn="物体追踪"
    ALGORITHM_OBJECT_TRACKING = 1,
    //%block="Object Recognition"
    //% block.loc.zh-tw="物體辨識"
    //% block.loc.zh-cn="物体辨识"
    ALGORITHM_OBJECT_RECOGNITION = 2,
    //%block="Line Tracking"
    //% block.loc.zh-tw="循線"
    //% block.loc.zh-cn="循线"
    ALGORITHM_LINE_TRACKING = 3,
    //%block="Color Recognition"
    //% block.loc.zh-tw="顏色辨識"
    //% block.loc.zh-cn="颜色辨识"
    ALGORITHM_COLOR_RECOGNITION = 4,
    //%block="Tag Recognition"
    //% block.loc.zh-tw="標籤辨識"
    //% block.loc.zh-cn="标签辨识"
    ALGORITHM_TAG_RECOGNITION = 5,
    //%block="Object Classification"
    //% block.loc.zh-tw="物體分類"
    //% block.loc.zh-cn="物体分类"
    OBJECTCLASSIFICATION,
    //%block="QR Recognition (EDU only)"
    //% block.loc.zh-tw="二維碼識別（教育版獨有）"
    //% block.loc.zh-cn="二维码识别（教育版独有）"
    QRRECOGMITION,
    //%block="Barcode Recognition (EDU only)"
    //% block.loc.zh-tw="條碼識別（教育版獨有）"
    //% block.loc.zh-cn="条码识别（教育版独有）"
    BARCODERECOGNITION,

}


//% weight=25  color=#e7660b icon="\uf083"  block="CUHK-JC iCar HuskyLens"
namespace huskylens {
    let protocolPtr: number[][] = [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0]]
    let Protocol_t: number[] = [0, 0, 0, 0, 0, 0]
    let i = 1;
    let FRAME_BUFFER_SIZE = 128
    let HEADER_0_INDEX = 0
    let HEADER_1_INDEX = 1
    let ADDRESS_INDEX = 2
    let CONTENT_SIZE_INDEX = 3
    let COMMAND_INDEX = 4
    let CONTENT_INDEX = 5
    let PROTOCOL_SIZE = 6
    let send_index = 0;
    let receive_index = 0;

    let COMMAND_REQUEST = 0x20;

    let receive_buffer: number[] = [];
    let send_buffer: number[] = [];
    let buffer: number[] = [];

    let send_fail = false;
    let receive_fail = false;
    let content_current = 0;
    let content_end = 0;
    let content_read_end = false;

    let command: number
    let content: number
    

    //% advanced=true shim=i2c::init
    function init(): void {
        return;
    }

    /**
     * HuskyLens initializes I2C until success
     */
    //%block="HuskyLens initialize I2C until success"
    //% block.loc.zh-tw="HuskyLens通過I2C初始化直到成功"
    //% block.loc.zh-cn="HuskyLens通过I2C初始化直到成功"
    //% weight=90
    export function initI2c(): void {
        init();
        while(!readKnock());

        yes();
    }
    /**
     * HuskyLens changes algorithm until success. Algorithms include “Face Recognition”, “Object Tracking”, “Object Recognition”, “Line Tracking”, “Color Recognition”, “Tag Recognition”, “Object Classification”, “QR Recognition“ (EDU only) and “Barcode Recognition” (EDU only)
     */
    //%block="HuskyLens switch algorithm to %mode"
    //% block.loc.zh-tw="HuskyLens切換到 %mode 算法直到成功"
    //% block.loc.zh-cn="HuskyLens切换到 %mode 算法直到成功"
    //% weight=85
    export function initMode(mode: protocolAlgorithm) {
        writeAlgorithm(mode, protocolCommand.COMMAND_REQUEST_ALGORITHM)
        while(!wait(protocolCommand.COMMAND_RETURN_OK));
        yes();
    }
    /**
     * HuskyLens requests data and stores it in the result.
     */
    //% block="HuskyLens request data once and save into the result"
    //% block.loc.zh-tw="HuskyLens請求一次數據存入結果"
    //% block.loc.zh-cn="HuskyLens请求一次数据存入结果"
    //% weight=80
    export function request(): void {
        protocolWriteCommand(protocolCommand.COMMAND_REQUEST)
        processReturn();
    }
    
    /**
     * HuskyLens gets the parameter of the box near the center of the screen from result  
     */
    //% block="HuskyLens get %data of frame closest to the center of screen from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取靠近中心方框的 %deta 參數"
    //% block.loc.zh-cn="HuskyLens从结果中获取靠近中心方框的 %deta 参数"
    //% weight=77
    //% advanced=true
    export function readBox_s(data: Content3): number {
        let hk_x
        let hk_y = readBlockCenterParameterDirect();
        if (hk_y != -1) {
            switch (data) {
                case 1:
                    hk_x = protocolPtr[hk_y][1]; break;
                case 2:
                    hk_x = protocolPtr[hk_y][2]; break;
                case 3:
                    hk_x = protocolPtr[hk_y][3]; break;
                case 4:
                    hk_x = protocolPtr[hk_y][4]; break;
                default:
                    hk_x = protocolPtr[hk_y][5];
            }
        }
        else hk_x = -1
        return hk_x;
    }
    /**
     * HuskyLens gets the parameter of the arrow near the center of the screen from result   
     */
    //% block="HuskyLens get %data of arrow closest to the center of screen from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取靠近中心箭頭的 %deta 參數"
    //% block.loc.zh-cn="HuskyLens从结果中获取靠近中心箭头的 %deta 参数"
    //% weight=76
    //% advanced=true
    export function readArrow_s(data: Content4): number {
        let hk_x
        let hk_y = readArrowCenterParameterDirect()
        if (hk_y != -1) {
            switch (data) {
                case 1:
                    hk_x = protocolPtr[hk_y][1]; break;
                case 2:
                    hk_x = protocolPtr[hk_y][2]; break;
                case 3:
                    hk_x = protocolPtr[hk_y][3]; break;
                case 4:
                    hk_x = protocolPtr[hk_y][4]; break;
                default:
                    hk_x = protocolPtr[hk_y][5];
            }
        }else hk_x = -1
        return hk_x;
    }
    /**
     * HuskyLens checks from result if the specific ID has been learned. Return true (1) if the specific ID has been learned. However, return false (0)
     * @param id to id ,eg: 1
     */
    //% block="HuskyLens check if ID %id is learned from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取ID %ID 是否已學習？"
    //% block.loc.zh-cn="HuskyLens从结果中获取ID %ID 是否已学习？ "
    //% weight=75
    //% advanced=true
    export function isLearned(id: number): boolean {
        let hk_x = countLearnedIDs();
        if (id <= hk_x) return true;
        return false;
    }
    /**
     * HuskyLens checks if box or arrow corresponding to a specific ID appears on the screen from result. Return true (1) if the statement is correct. However, return false (0)
     * @param id to id ,eg: 1
     */
    //% block="HuskyLens check if ID %id %Ht is on screen from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取ID %ID 的 %Ht 是否在畫面中？"
    //% block.loc.zh-cn="HuskyLens从结果中获取ID %ID 的 %Ht 是否在画面中？ "
    //% weight=75
    export function isAppear(id: number, Ht: HUSKYLENSResultType_t): boolean {
        switch (Ht) {
            case 1:
                return countBlocks(id) != 0 ? true : false ;
            case 2:
                return countArrows(id) != 0 ? true : false;
            default:
                return false;
        }
    }
    /**
     * HuskyLens gets the parameter of the box corresponding to the specific ID from result   
     * @param id to id ,eg: 1
     */
    //%block="HuskyLens get  $number1 of ID $id frame from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取ID %ID 方框的參數 %number1"
    //% block.loc.zh-cn="HuskyLens从结果中获取ID %ID 方框的参数 %number1"
    //% weight=65
    export function readeBox( id: number,number1: Content1): number {
        let hk_y = cycle_block(id, 1);
        let hk_x
        if (countBlocks(id) != 0) {
            if (hk_y != null) {
                switch (number1) {
                    case 1:
                        hk_x = protocolPtr[hk_y][1]; break;
                    case 2:
                        hk_x = protocolPtr[hk_y][2]; break;
                    case 3:
                        hk_x = protocolPtr[hk_y][3]; break;
                    case 4:
                        hk_x = protocolPtr[hk_y][4]; break;
                }
            }
            else hk_x = -1;
        }
        else hk_x = -1;
        return hk_x;
    }
     /**
     * HuskyLens gets the parameter of the arrow corresponding to the specific ID from result   
     * @param id to id ,eg: 1
     */

    //%block="HuskyLens get $number1 of ID $id arrow from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取ID %ID 箭頭的參數 %number1"
    //% block.loc.zh-cn="HuskyLens从结果中获取ID %ID 箭头的参数 %number1"
    //% weight=60
    export function readeArrow(id: number,number1: Content2): number {
        let hk_y = cycle_arrow(id, 1);
        let hk_x
        if (countArrows(id) != 0) {
            if (hk_y != null) {

                switch (number1) {
                    case 1:
                        hk_x = protocolPtr[hk_y][1]; break;
                    case 2:
                        hk_x = protocolPtr[hk_y][2]; break;
                    case 3:
                        hk_x = protocolPtr[hk_y][3]; break;
                    case 4:
                        hk_x = protocolPtr[hk_y][4]; break;
                    default:
                        hk_x = -1;
                }
            }
            else hk_x = -1;
        }
        else hk_x = -1;
        return hk_x;
    }
    /**
     * HuskyLens gets the total number of box or arrow from result
     * 
     */
    //%block="HuskyLens get a total number of %Httotal from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取 %Ht 總數"
    //% block.loc.zh-cn="HuskyLens从结果中获取 %Ht 总数"
    //% weight=90
    //% advanced=true
    export function getBox(Ht: HUSKYLENSResultType_t): number {
        switch (Ht) {
            case 1:
                return countBlocks_s();
            case 2:
                return countArrows_s();
            default:
                return 0;
        }
    }
    /**
     * HuskyLens gets the parameter of the Nth box from result
     * @param index to index ,eg: 1
     */
    //% block="HuskyLens get $data of the No. $index frame from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取第 %index 個方框 %deta 參數"
    //% block.loc.zh-cn="HuskyLens从结果中获取第 %index 个方框 %deta 参数"
    //% weight=61
    //% advanced=true
    export function readBox_ss(index: number, data: Content3): number {
        let hk_x = -1
        let hk_i = index - 1
        if (protocolPtr[hk_i][0] == protocolCommand.COMMAND_RETURN_BLOCK) {
            switch (data) {
                case 1:
                    hk_x = protocolPtr[hk_i][1]; break;
                case 2:
                    hk_x = protocolPtr[hk_i][2]; break;
                case 3:
                    hk_x = protocolPtr[hk_i][3]; break;
                case 4:
                    hk_x = protocolPtr[hk_i][4]; break;
                default:
                    hk_x = protocolPtr[hk_i][5];
            }
        } else hk_x = -1;
        return hk_x;
        
    }
    /**
     * HuskyLens gets the parameter of the Nth arrow from result
     * @param index to index ,eg: 1
    */
    //% block="HuskyLens get $data of the No. $index arrow from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取第 %index 個箭頭 %deta 參數"
    //% block.loc.zh-cn="HuskyLens从结果中获取第 %index 个箭头 %deta 参数"
    //% weight=60
    //% advanced=true
    export function readArrow_ss(index: number, data: Content4): number {
        let hk_x
        let hk_i = index - 1
        if (protocolPtr[hk_i][0] == protocolCommand.COMMAND_RETURN_ARROW) {
            switch (data) {
                case 1:
                    hk_x = protocolPtr[hk_i][1]; break;
                case 2:
                    hk_x = protocolPtr[hk_i][2]; break;
                case 3:
                    hk_x = protocolPtr[hk_i][3]; break;
                case 4:
                    hk_x = protocolPtr[hk_i][4]; break;
                default:
                    hk_x = protocolPtr[hk_i][5];
            }
        } else hk_x = -1;
        //protocolPtr[hk_i][0] = 0;
        return hk_x;
    }
    /**
     * HuskyLens gets the total number of box or arrow corresponding to the specific ID from result  
     * @param id to id ,eg: 1
     */
    //%block="HuskyLens get a total number of ID %id %Httotal from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取ID %ID %Ht 總數"
    //% block.loc.zh-cn="HuskyLens从结果中获取ID %ID %Ht 总数"
    //% weight=55
    //% advanced=true
    export function getBox_S(id: number, Ht: HUSKYLENSResultType_t): number {
        switch (Ht) {
            case 1:
                return countBlocks(id);
            case 2:
                return countArrows(id);
            default:
                return 0;
        }
    }
    /**
     * HuskyLens gets the parameter of the Nth box corresponding to the specific ID from result   
     * @param id to id ,eg: 1
     * @param index to index ,eg: 1
     */
    //%block="HuskyLens get $number1 of the ID $id  No. $index frame from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取ID %ID 第 %index 個方框的參數 %number1"
    //% block.loc.zh-cn="HuskyLens从结果中获取ID %ID 第 %index 个方框的参数 %number1"
    //% weight=45
    //% advanced=true
    export function readeBox_index(id: number, index: number, number1: Content1): number {
        let hk_y = cycle_block(id, index);
        let hk_x
        if (countBlocks(id) != 0) {
            if (hk_y != null) {
                switch (number1) {
                    case 1:
                        hk_x = protocolPtr[hk_y][1]; break;
                    case 2:
                        hk_x = protocolPtr[hk_y][2]; break;
                    case 3:
                        hk_x = protocolPtr[hk_y][3]; break;
                    case 4:
                        hk_x = protocolPtr[hk_y][4]; break;
                    default:
                        hk_x = -1;
                }
            }
            else hk_x = -1;
        }
        else hk_x = -1;
        return hk_x;
    }
    /**
     * HuskyLens gets the parameter of the Nth arrow corresponding to the specific ID from result   
     * @param id to id ,eg: 1
     * @param index to index ,eg: 1
     */
    //%block="HuskyLens get $number1 of the ID $id No. $index arrow from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取ID %ID 第 %index 個箭頭的參數 %number1"
    //% block.loc.zh-cn="HuskyLens从结果中获取ID %ID 第 %index 个箭头的参数 %number1"
    //% weight=35
    //% advanced=true
    export function readeArrow_index(index: number, id: number, number1: Content2): number {
        let hk_y = cycle_arrow(id, index);
        let hk_x
        if (countArrows(id) != 0) {
            if (hk_y != null) {
                switch (number1) {
                    case 1:
                        hk_x = protocolPtr[hk_y][1]; break;
                    case 2:
                        hk_x = protocolPtr[hk_y][2]; break;
                    case 3:
                        hk_x = protocolPtr[hk_y][3]; break;
                    case 4:
                        hk_x = protocolPtr[hk_y][4]; break;
                    default:
                        hk_x = -1;
                }
            }
            else hk_x = -1;
        }
        else hk_x = -1;
        return hk_x;
    }
    /**
     * HuskyLens learns the specific ID once automatically   
     * @param id to id ,eg: 1
     */
    //%block="HuskyLens learn ID %id once automatically"
    //% block.loc.zh-tw="HuskyLens自動學習一次ID %id"
    //% block.loc.zh-cn="HuskyLens自动学习一次ID %id"
    //% weight=30
    //% advanced=true
    export function writeLearn1(id: number):void{
        writeAlgorithm(id, 0X36)
        //while(!wait(protocolCommand.COMMAND_RETURN_OK));
    }
    /**
     * HuskyLens forgets all learning data of the current algorithm
     */
    //%block="HuskyLens forget all learning data of the current algorithm"
    //% block.loc.zh-tw="HuskyLens遺忘當前算法的所有學習數據"
    //% block.loc.zh-cn="HuskyLens遗忘当前算法的所有学习数据"
    //% weight=29
    //% advanced=true
    export function forgetLearn():void{
        writeAlgorithm(0x47, 0X37)
        //while(!wait(protocolCommand.COMMAND_RETURN_OK));
    }
    /**
     * HuskyLens sets the name of the specific ID of the current algorithm  
     * @param id to id ,eg: 1
     * @param name to name ,eg: "DFRobot"
     */
    //%block="HuskyLens name ID %id of the current algorithm as %name"
    //% block.loc.zh-tw="HuskyLens設定當前算法ID %id 名稱 %name"
    //% block.loc.zh-cn="HuskyLens设定当前算法ID %id 名称 %name"
    //% weight=28
    //% advanced=true
    export function writeName(id:number,name:string):void{
        //do{
            let newname = name;
            let buffer = husky_lens_protocol_write_begin(0x2f);
            send_buffer[send_index] = id;
            send_buffer[send_index+1] = (newname.length + 1) * 2;
            send_index += 2;
            for(let i=0;i<newname.length;i++){
                send_buffer[send_index] = newname.charCodeAt(i);
                //serial.writeNumber(newname.charCodeAt(i))
                send_index ++;
            }
            send_buffer[send_index]=0;
            send_index += 1;
            let length = husky_lens_protocol_write_end();
            let Buffer = pins.createBufferFromArray(buffer);
            protocolWrite(Buffer);
        //}while(!wait(protocolCommand.COMMAND_RETURN_OK));
    }
    /**
     * HuskyLens displays characters on the specific position of the screen
     * @param name to name ,eg: "DFRobot"
     * @param x to x ,eg: 150
     * @param y to y ,eg: 30
     */
    //%block="HuskyLens show custom texts %name at position x %x y %y on screen"
    //% block.loc.zh-tw="HuskyLens螢幕疊加顯示文字 %name 在x %x y %y"
    //% block.loc.zh-cn="HuskyLens萤幕叠加显示文字 %name 在x %x y %y"
    //% weight=27
    //% advanced=true
    //% x.min=0 x.max=319
    //% y.min=0 y.max=210
    export function writeOSD(name:string, x:number, y:number):void{
        //do{
            let buffer = husky_lens_protocol_write_begin(0x34);
            send_buffer[send_index] = name.length;
            if(x>255){
                send_buffer[send_index+2] = (x%255);
                send_buffer[send_index+1] = 0xff;
            }else{
                 send_buffer[send_index+1] = 0;
                send_buffer[send_index+2] = x;
            }
            send_buffer[send_index+3] = y;
            send_index += 4;
            for(let i=0;i<name.length;i++){
                send_buffer[send_index] = name.charCodeAt(i);
                //serial.writeNumber(name.charCodeAt(i));
                send_index ++;
            }
            let length = husky_lens_protocol_write_end();
            //serial.writeNumber(length)
            let Buffer = pins.createBufferFromArray(buffer);
            protocolWrite(Buffer);
        //}while(!wait(protocolCommand.COMMAND_RETURN_OK));
    }
    /**
     * HuskyLens clears characters on the screen   
     */
    //%block="HuskyLens clear all custom texts on screen"
    //% block.loc.zh-tw="HuskyLens清除螢幕顯示的文字"
    //% block.loc.zh-cn="HuskyLens清除萤幕显示的文字"
    //% weight=26
    //% advanced=true
    export function clearOSD():void{
        writeAlgorithm(0x45, 0X35);
        //while(!wait(protocolCommand.COMMAND_RETURN_OK));
    }
    /**
     * HuskyLens takes a photo or screenshot and save it in the SD card
     */
    //%block="HuskyLens take %request and save to SD card"
    //% block.loc.zh-tw="HuskyLens觸發 %request 保存到SD卡"
    //% block.loc.zh-cn="HuskyLens触发 %request 保存到SD卡"
    //% weight=25
    //% advanced=true
    export function takePhotoToSDCard(request:HUSKYLENSphoto):void{
        switch(request){
        case HUSKYLENSphoto.PHOTO:
            writeAlgorithm(0x40, 0X30)
            //while(!wait(protocolCommand.COMMAND_RETURN_OK))
            break;
        case HUSKYLENSphoto.SCREENSHOT:
            writeAlgorithm(0x49, 0X39)
            //while(!wait(protocolCommand.COMMAND_RETURN_OK));
            break;
        default:
            writeAlgorithm(0x40, 0X30)
            //while(!wait(protocolCommand.COMMAND_RETURN_OK));
        } 
        basic.pause(500)
    }
    /**
     * HuskyLens saves or loads all learning data of the current algorithm to the SD card or from the SD card
     */
    //%block="HuskyLens %command current algorithm data as No. %data model of SD card"
    //% block.loc.zh-tw="HuskyLens %command 當前算法數據為SD卡 %data 號模型"
    //% block.loc.zh-cn="HuskyLens %command 当前算法数据为SD卡 %data 号模型"
    //% weight=24
    //% advanced=true
    //% data.min=0 data.max=5
    export function saveModelToTFCard(command:HUSKYLENSMode,data:number):void{
       switch(command){
       case HUSKYLENSMode.SAVE:
            writeAlgorithm(data,0x32);
            //while(!wait(protocolCommand.COMMAND_RETURN_OK));
            break;
        case HUSKYLENSMode.LOAD:
            writeAlgorithm(data,0x33);
            //while(!wait(protocolCommand.COMMAND_RETURN_OK));
            break;
        default:
            writeAlgorithm(data,0x32);
            //while(!wait(protocolCommand.COMMAND_RETURN_OK));
       }
       basic.pause(500)
    }
    /**
     * HuskyLens gets the total number of learned ID from result
     */
    //%block="HuskyLens get a total number of learned IDs from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取已學ID總數"
    //% block.loc.zh-cn="HuskyLens从结果中获取已学ID总数"
    //% weight=79
    //% advanced=true
    export function getIds(): number {
        return Protocol_t[2];
    }
    /**
     * HuskyLens checks if box or arrow appears on the screen from result. Return true (1) if the statement is correct. However, return false (0)
     */
    //%block="HuskyLens check if %Ht is on screen from the result"
    //% block.loc.zh-tw="HuskyLens從結果中獲取 %Ht是否在畫面中?"
    //% block.loc.zh-cn="HuskyLens从结果中获取 %Ht是否在画面中?"
    //% weight=78
    export function isAppear_s(Ht: HUSKYLENSResultType_t): boolean {
        switch (Ht) {
            case 1:
                return countBlocks_s() != 0 ? true:false;
            case 2:
                return countArrows_s() != 0 ? true:false;
            default:
                return false;
        }
    }

    function validateCheckSum() {

        let stackSumIndex = receive_buffer[3] + CONTENT_INDEX;
        let hk_sum = 0;
        for (let i = 0; i < stackSumIndex; i++) {
            hk_sum += receive_buffer[i];
        }
        hk_sum = hk_sum & 0xff;

        return (hk_sum == receive_buffer[stackSumIndex]);
    }

    function husky_lens_protocol_write_end() {
        if (send_fail) { return 0; }
        if (send_index + 1 >= FRAME_BUFFER_SIZE) { return 0; }
        send_buffer[CONTENT_SIZE_INDEX] = send_index - CONTENT_INDEX;
        //serial.writeValue("618", send_buffer[CONTENT_SIZE_INDEX])
        let hk_sum = 0;
        for (let i = 0; i < send_index; i++) {
            hk_sum += send_buffer[i];
        }

        hk_sum = hk_sum & 0xff;
        send_buffer[send_index] = hk_sum;
        send_index++;
        return send_index;
    }
    
    function husky_lens_protocol_write_begin(command = 0) {
        send_fail = false;
        send_buffer[HEADER_0_INDEX] = 0x55;
        send_buffer[HEADER_1_INDEX] = 0xAA;
        send_buffer[ADDRESS_INDEX] = 0x11;
        //send_buffer[CONTENT_SIZE_INDEX] = datalen;
        send_buffer[COMMAND_INDEX] = command;
        send_index = CONTENT_INDEX;
        return send_buffer;
    }
    
    function protocolWrite(buffer: Buffer) {
        pins.i2cWriteBuffer(0x32, buffer, false);
        basic.pause(50)
    }

    function processReturn() {
        if (!wait(protocolCommand.COMMAND_RETURN_INFO)) return false;
        protocolReadFiveInt16(protocolCommand.COMMAND_RETURN_INFO);
        for (let i = 0; i < Protocol_t[1]; i++) {
           
            if (!wait()) return false;
            if (protocolReadFiveInt161(i, protocolCommand.COMMAND_RETURN_BLOCK)) continue;
            else if (protocolReadFiveInt161(i, protocolCommand.COMMAND_RETURN_ARROW)) continue;
            else return false;
        }
        return true;
    }   

    function wait(command = 0) {
        timerBegin();
        while(!timerAvailable()) {
            if (protocolAvailable()) {
                if (command) {
                    if (husky_lens_protocol_read_begin(command)) {
                        //serial.writeNumber(0);
                        return true;
                    }
                }
                else {
                    return true;
                }
            }else{
                return false;
            }
        }
        return false;
    }
    
    function husky_lens_protocol_read_begin(command = 0) {
        if (command == receive_buffer[COMMAND_INDEX]) {
            content_current = CONTENT_INDEX;
            content_read_end = false;
            receive_fail = false;
            return true;
        }
        return false;
    }
    
    let timeOutDuration = 100;
    let timeOutTimer: number
    function timerBegin() {
        timeOutTimer = input.runningTime();
    }
    
    function timerAvailable() {
        return (input.runningTime() - timeOutTimer > timeOutDuration);
    }
    
    let m_i = 16
    function protocolAvailable() {
        let buf = pins.createBuffer(16)
        if (m_i == 16) {
            buf = pins.i2cReadBuffer(0x32, 16, false);
            m_i = 0;
        }
        for (let i = m_i; i < 16; i++) {
            if (husky_lens_protocol_receive(buf[i])) {
                m_i++;
                return true;
            }
            m_i++;
        }
        return false
    }
    
    function husky_lens_protocol_receive(data: number): boolean {
        switch (receive_index) {
            case HEADER_0_INDEX:
                if (data != 0x55) { receive_index = 0; return false; }
                receive_buffer[HEADER_0_INDEX] = 0x55;
                break;
            case HEADER_1_INDEX:
                if (data != 0xAA) { receive_index = 0; return false; }
                receive_buffer[HEADER_1_INDEX] = 0xAA;
                break;
            case ADDRESS_INDEX:
                receive_buffer[ADDRESS_INDEX] = data;
                break;
            case CONTENT_SIZE_INDEX:
                if (data >= FRAME_BUFFER_SIZE - PROTOCOL_SIZE) { receive_index = 0; return false; }
                receive_buffer[CONTENT_SIZE_INDEX] = data;
                break;
            default:
                receive_buffer[receive_index] = data;

                if (receive_index == receive_buffer[CONTENT_SIZE_INDEX] + CONTENT_INDEX) {
                    content_end = receive_index;
                    receive_index = 0;
                    return validateCheckSum();

                }
                break;
        }
        receive_index++;
        return false;
    }

    function husky_lens_protocol_write_int16(content = 0) {

        let x: number = ((content.toString()).length)
        if (send_index + x >= FRAME_BUFFER_SIZE) { send_fail = true; return; }
        send_buffer[send_index] = content & 0xff;
        send_buffer[send_index + 1] = (content >> 8) & 0xff;
        send_index += 2;
    }
    
    function protocolReadFiveInt16(command = 0) {
        if (husky_lens_protocol_read_begin(command)) {
            Protocol_t[0] = command;
            Protocol_t[1] = husky_lens_protocol_read_int16();
            Protocol_t[2] = husky_lens_protocol_read_int16();
            Protocol_t[3] = husky_lens_protocol_read_int16();
            Protocol_t[4] = husky_lens_protocol_read_int16();
            Protocol_t[5] = husky_lens_protocol_read_int16();
            husky_lens_protocol_read_end();
            return true;
        }
        else {
            return false;
        }
    }
    
    function protocolReadFiveInt161(i: number, command = 0) {
        if (husky_lens_protocol_read_begin(command)) {
            protocolPtr[i][0] = command;
            protocolPtr[i][1] = husky_lens_protocol_read_int16();
            protocolPtr[i][2] = husky_lens_protocol_read_int16();
            protocolPtr[i][3] = husky_lens_protocol_read_int16();
            protocolPtr[i][4] = husky_lens_protocol_read_int16();
            protocolPtr[i][5] = husky_lens_protocol_read_int16();
            husky_lens_protocol_read_end();
            return true;
        }
        else {
            return false;
        }
    }

    function husky_lens_protocol_read_int16() {
        if (content_current >= content_end || content_read_end) { receive_fail = true; return 0; }
        let result = receive_buffer[content_current + 1] << 8 | receive_buffer[content_current];
        content_current += 2
        return result;
    }
    
    function husky_lens_protocol_read_end() {
        if (receive_fail) {
            receive_fail = false;
            return false;
        }
        return content_current == content_end;
    }
     
    function countLearnedIDs() {
        return Protocol_t[2]
    }
    
    function countBlocks(ID: number) {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_BLOCK && protocolPtr[i][5] == ID) counter++;
        }
        return counter;
    }
    
    function countBlocks_s() {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_BLOCK) counter++;
        }
        //serial.writeNumber(counter)
        return counter;
    }
    
    function countArrows(ID: number) {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_ARROW && protocolPtr[i][5] == ID) counter++;
        }
        return counter;
    }
    
    function countArrows_s() {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_ARROW) counter++;
        }
        return counter;
    }
    
    function readKnock() {
        for (let i = 0; i < 5; i++) {
            protocolWriteCommand(protocolCommand.COMMAND_REQUEST_KNOCK);//I2C
            if (wait(protocolCommand.COMMAND_RETURN_OK)) {
                return true;
            }
        }
        return false;
    }

    function writeForget() {
        for (let i = 0; i < 5; i++) {
            protocolWriteCommand(protocolCommand.COMMAND_REQUEST_FORGET);
            if (wait(protocolCommand.COMMAND_RETURN_OK)) {
                return true;
            }
        }
        return false;
    }
    
    function protocolWriteCommand(command = 0) {
        Protocol_t[0] = command;
        let buffer = husky_lens_protocol_write_begin(Protocol_t[0]);
        let length = husky_lens_protocol_write_end();
        let Buffer = pins.createBufferFromArray(buffer);
        protocolWrite(Buffer);
    }
    
    function protocolReadCommand(command = 0) {
        if (husky_lens_protocol_read_begin(command)) {
            Protocol_t[0] = command;
            husky_lens_protocol_read_end();
            return true;
        }
        else {
            return false;
        }
    }
    
    function writeAlgorithm(algorithmType : number,comemand = 0){
        protocolWriteOneInt16(algorithmType, comemand);
        //return true//wait(protocolCommand.COMMAND_RETURN_OK);
        //while(!wait(protocolCommand.COMMAND_RETURN_OK));
        //return true
    }

    function writeLearn(algorithmType: number) {
        protocolWriteOneInt16(algorithmType, protocolCommand.COMMAND_REQUEST_LEARN);
        return wait(protocolCommand.COMMAND_RETURN_OK);
    }

    function protocolWriteOneInt16(algorithmType: number, command = 0) {
        let buffer = husky_lens_protocol_write_begin(command);
        husky_lens_protocol_write_int16(algorithmType);
        let length = husky_lens_protocol_write_end();
        let Buffer = pins.createBufferFromArray(buffer);
        protocolWrite(Buffer);
    }

    function cycle_block(ID: number, index = 1): number {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_BLOCK && protocolPtr[i][5] == ID) {
                counter++;
                if (index == counter) return i;

            }
        }
        return null;
    }
    
    function cycle_arrow(ID: number, index = 1): number {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_ARROW && protocolPtr[i][5] == ID) {
                counter++;
                if (index == counter) return i;

            }
        }
        return null;
    }

    function readBlockCenterParameterDirect(): number {
        let distanceMinIndex = -1;
        let distanceMin = 65535;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_BLOCK) {
                let distance = Math.round(Math.sqrt(Math.abs(protocolPtr[i][1] - 320 / 2))) + Math.round(Math.sqrt(Math.abs(protocolPtr[i][2] - 240 / 2)));
                if (distance < distanceMin) {
                    distanceMin = distance;
                    distanceMinIndex = i;
                }
            }
        }
        return distanceMinIndex
    }

    function readArrowCenterParameterDirect(): number {
        let distanceMinIndex = -1;
        let distanceMin = 65535;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_ARROW) {
                let distance = Math.round(Math.sqrt(Math.abs(protocolPtr[i][1] - 320 / 2))) + Math.round(Math.sqrt(Math.abs(protocolPtr[i][2] - 240 / 2)));
                if (distance < distanceMin) {
                    distanceMin = distance;
                    distanceMinIndex = i;
                }
            }
        }
        return distanceMinIndex
    }

    function no():void
    {
        basic.showIcon(IconNames.No);
        basic.pause(100);
        basic.clearScreen();
        basic.pause(100);
    }
    function yes():void
    {
        basic.showIcon(IconNames.Yes);
        basic.pause(100);
        basic.clearScreen();
    }
    
    
}
