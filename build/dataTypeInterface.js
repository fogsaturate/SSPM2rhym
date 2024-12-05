"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataType = void 0;
var dataType;
(function (dataType) {
    dataType[dataType["unsigned8Bit"] = 1] = "unsigned8Bit";
    dataType[dataType["unsigned16Bit"] = 2] = "unsigned16Bit";
    dataType[dataType["unsigned32Bit"] = 3] = "unsigned32Bit";
    dataType[dataType["unsigned64Bit"] = 4] = "unsigned64Bit";
    dataType[dataType["float32Bit"] = 5] = "float32Bit";
    dataType[dataType["float64Bit"] = 6] = "float64Bit";
    dataType[dataType["position"] = 7] = "position";
    dataType[dataType["buffer"] = 8] = "buffer";
    dataType[dataType["shortUTF8String"] = 9] = "shortUTF8String";
    dataType[dataType["longBuffer"] = 10] = "longBuffer";
    dataType[dataType["longUTF8String"] = 11] = "longUTF8String";
    dataType[dataType["array"] = 12] = "array";
})(dataType || (exports.dataType = dataType = {}));
//# sourceMappingURL=dataTypeInterface.js.map