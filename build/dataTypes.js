"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Difficulties = exports.dataTypes = void 0;
const binary_parser_1 = require("binary-parser");
const noteType = new binary_parser_1.Parser()
    .uint8('noteStorageType') // bool that decides if its quantum or not
    .choice('noteObject', {
    tag: 'noteStorageType',
    choices: {
        0: new binary_parser_1.Parser()
            .uint8('x') // 1 byte integer for position
            .uint8('y'),
        1: new binary_parser_1.Parser()
            .floatle('x') // 4 byte float for position
            .floatle('y')
    }
});
const longUTF8Type = new binary_parser_1.Parser().uint32le('longUTF8StringLength').string('longUTF8String', { length: 'longUTF8StringLength', encoding: 'utf8' });
exports.dataTypes = {
    longUTF8Type,
    noteType
};
var Difficulties;
(function (Difficulties) {
    Difficulties[Difficulties["N/A"] = 0] = "N/A";
    Difficulties[Difficulties["Easy"] = 1] = "Easy";
    Difficulties[Difficulties["Medium"] = 2] = "Medium";
    Difficulties[Difficulties["Hard"] = 3] = "Hard";
    Difficulties[Difficulties["Logic"] = 4] = "Logic";
    Difficulties[Difficulties["Tasukete"] = 5] = "Tasukete";
})(Difficulties || (exports.Difficulties = Difficulties = {}));
;
//# sourceMappingURL=dataTypes.js.map