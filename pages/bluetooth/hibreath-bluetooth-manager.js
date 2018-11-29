import SimpleBlueToothImp from "../../libs/bluetooth/simple-bluetooth-imp";

export default class HiBreathBLManager extends SimpleBlueToothImp {
    constructor() {
        super();
        this._isFirstReceive = true;
        this.setUUIDs({services: ['xxxx']});//xxxx为全称UUID
    }

    sendData({buffer}) {
        if (buffer && buffer.byteLength) {
            super.sendData({buffer}).then(res => {
                console.log('writeBLECharacteristicValue success成功', res.errMsg);
                const dataView = new DataView(buffer, 0);
                const byteLength = buffer.byteLength;
                for (let i = 0; i < byteLength; i++) {
                    console.log(dataView.getUint8(i));
                }
            }).catch(res => console.log(res));
        } else {
            console.log('发送的buffer是空');
        }
    }

    disconnect() {
        return super.disconnect().then(() => this._isFirstReceive = true);
    }

    closeAll() {
        return super.closeAll().then(() => this._isFirstReceive = true);
    }

    dealReceiveData({result}) {
        if (this._isFirstReceive) {
            this._isFirstReceive = false;
            this._firstHandResponse();
        } else {
            const byteLength = result.value.byteLength;
            const receiverDataView = new DataView(result.value, 0);
            const sendBuffer = new ArrayBuffer(byteLength + 2);
            const sendDataView = new DataView(sendBuffer, 0);
            let count = 0, temp;
            for (let k = 0; k < byteLength; k++) {
                temp = receiverDataView.getUint8(k);
                sendDataView.setUint8(k, temp);
                count += temp;
            }
            console.log('和', count, '长度', byteLength);
            count = count % 128;
            sendDataView.setUint8(byteLength, count);
            sendDataView.setUint8(byteLength + 1, byteLength);
            this.sendData({buffer: sendBuffer});
        }
        HiBreathBLManager.logReceiveData({result});
        return result;
    }

    _firstHandResponse() {
        const str = Date.now().toString();
        let strArray = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            strArray[i] = str.charCodeAt(i);
        }
        const array = new Uint8Array(strArray.length);
        strArray.forEach((item, index) => array[index] = item);
        this.sendData({buffer: array.buffer})
    }

    static logReceiveData({result}) {
        const byteLength = result.value.byteLength;
        // const buffer = new ArrayBuffer(byteLength);
        const dataView = new DataView(result.value, 0);
        for (let k = 0; k < byteLength; k++) {
            console.log(`接收到的数据索引：${k} 值：${dataView.getUint8(k)}`);
        }
    }
};