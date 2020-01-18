import {IBLEProtocolReceiveBody} from "../lb-ble-common-protocol-body/index";

export default class ReceiveBody extends IBLEProtocolReceiveBody {
    constructor() {
        //commandIndex 命令字位置索引
        //dataStartIndex  有效数据开始索引，比如：填写0，{getEffectiveReceiveDataLength}中返回20，则会在{LBlueToothProtocolOperator}的子类{getReceiveAction}实现中，在参数中返回所有数据
        super({commandIndex: 1, dataStartIndex: 0});
    }

    getEffectiveReceiveDataLength({receiveArray}) {
        return 20;
    }
}
