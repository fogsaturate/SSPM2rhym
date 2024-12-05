"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSPMParser = void 0;
const binary_parser_1 = require("binary-parser");
const dataTypes_1 = require("./dataTypes");
exports.SSPMParser = new binary_parser_1.Parser() // binary time yay!
    // .skip(4) // magic number
    .string('magicNumber', {
    length: 4,
    encoding: 'utf8'
})
    // .skip(2) // version number
    .uint16le('version')
    .skip(4) // reserved space
    .skip(20) // SHA-1 hash
    // .string('SHA-1', {
    //     length: 20,
    //     encoding: 'utf8'
    // })
    // object metadata
    // .skip(4) // millisecond of last marker/note
    // .skip(4) // total note count
    .uint32le('lastMarkerTime')
    .uint32le('noteCount')
    .uint32le('markerCount') // we are going to be using this for notes since thats basically what they are
    .uint8('difficulty')
    // .skip(2) // star rating
    .uint16le('starRating')
    .uint8('audioBool')
    .uint8('coverBool')
    .uint8('modChartBool')
    // .skip(1) // mod chart bool
    // pointers
    .uint64le('customDataOffset')
    .uint64le('customDataLength')
    .uint64le('audioDataOffset')
    .uint64le('audioDataLength')
    .uint64le('coverDataOffset')
    .uint64le('coverDataLength')
    .uint64le('markerDefOffset')
    .uint64le('markerDefLength')
    .uint64le('markerSectionOffset')
    .uint64le('markerSectionLength')
    // song metadata
    .uint16le('mapIDLength')
    .string('mapID', { length: 'mapIDLength', encoding: 'utf8' })
    .uint16le('mapNameLength') // artist - title
    .string('mapName', { length: 'mapNameLength', encoding: 'utf8' })
    .uint16le('songNameLength')
    .string('songName', { length: 'songNameLength', encoding: 'utf8' }) // i would usually skip this, but its more work in typescript
    .uint16le('mapperArrayLength')
    .array('mappers', {
    length: 'mapperArrayLength',
    type: new binary_parser_1.Parser()
        .uint16le('mapperNameLength')
        .string('mapper', { length: 'mapperNameLength', encoding: 'utf8' })
})
    .uint16le('customDataArrayLength')
    .array('customDataObject', {
    length: 'customDataArrayLength',
    type: new binary_parser_1.Parser()
        .uint16le('customDataObjectIDLength') // every custom data object has an ID
        .string('customDataObjectID', { length: 'customDataObjectIDLength', encoding: 'utf8' }) // this will 100% of the time be "difficulty_name"
        .uint8('customDataType') // 100% of the time going to be "0B" which is a "Long UTF-8 String"
        .choice('customData', {
        tag: 'customDataType',
        choices: {
            11: dataTypes_1.dataTypes.longUTF8Type // this is what grabs the difficulty name! (the difficulty name is a long utf-8 string)
        }
    }) // fucking finally lmao
})
    .seek(function () {
    return Number(this.audioDataLength); // we are skipping this because we will read the audio data after we are done parsing the binary file (MP3 or OGG)
})
    .seek(function () {
    return Number(this.coverDataLength); // ^^^^^^ except with the cover data (PNG data)
})
    // const markerSSPMParser = new Parser()
    // start of marker definitions
    .uint8('markerDefinitionArrayLength')
    .array('markerDefinitions', {
    length: 'markerDefinitionArrayLength',
    type: new binary_parser_1.Parser()
        .uint16le('markerDefinitionIDLength')
        .string('markerDefinitionID', { length: 'markerDefinitionIDLength', encoding: 'utf8' }) // this is 100% of the time going to be "ssp_note"
        .uint8('markerDefinitionDataTypeCount')
        .uint8('markerDefinitionDataType') // 100% of the time going to be 7
        .uint8('markerDefinitionEnd')
})
    // end of marker definitions
    .array('markerObject', {
    length: function () { return this.markerCount; },
    // length: 50,
    type: new binary_parser_1.Parser()
        .uint32le('time') // in milliseconds, of the marker (100% the note)
        .uint8('markerDefinitionIndex') // 100% of the time going to be 0 since theres only one marker definition
        .array('markerData', {
        length: function () { return this.markerDefinitionIndex + 1; }, // adding 1 because length needs to be 1 or else it wont work (it doesnt work off of index logic)
        // length: 1,
        type: new binary_parser_1.Parser()
            .choice('markerType', {
            // tag: function(this: any) {return this.markerDefinitions[0].markerDefinitionDataType}, // no matter what i do, this doesnt work
            // tag: 7,
            tag: function () { return 7; }, // i cant use integers, nor can i grab from arrays so im just gonna return 7
            choices: {
                7: dataTypes_1.dataTypes.noteType
            }
        })
    })
});
//# sourceMappingURL=sspmParser.js.map