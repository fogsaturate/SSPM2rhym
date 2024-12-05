"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const binary_parser_1 = require("binary-parser");
const dataTypes_1 = require("./dataTypes");
const sspmParser_1 = require("./sspmParser");
const path_1 = __importDefault(require("path"));
const filePath = path_1.default.join(__dirname, '../src/input/xr_attractor_dimension.sspm');
function outputPath(outputFilename) {
    const outputFolder = path_1.default.join(__dirname, '../src/output');
    return path_1.default.join(outputFolder, outputFilename);
}
function bigIntReplacer(key, value) {
    if (typeof value === 'bigint') {
        return value.toString(); // You can also choose to return Number(value) if needed
    }
    return value; // Leave other values unchanged
}
;
function audioFormatChecker(buffer) {
    const audioHeaderParser = new binary_parser_1.Parser()
        .string('', { length: 4, encoding: 'utf8' }); // OGG headers have OggS as the header
    const audioOutput = audioHeaderParser.parse(buffer);
    // console.log(audioOutput)
    return audioOutput;
}
;
function parseSSPM(filePath) {
    const buffer = fs_1.default.readFileSync(filePath);
    const SSPMResult = sspmParser_1.SSPMParser.parse(buffer);
    if (SSPMResult.audioBool === 1) {
        const audioBuffer = buffer.subarray(Number(SSPMResult.audioDataOffset), Number(SSPMResult.audioDataOffset) + Number(SSPMResult.audioDataLength));
        const { audioOutput } = audioFormatChecker(audioBuffer);
        if (audioOutput === 'OggS') {
            const outputFiletoFolder = outputPath('audio.ogg');
            fs_1.default.writeFileSync(outputFiletoFolder, audioBuffer);
        }
        else {
            const outputFiletoFolder = outputPath('audio.mp3');
            fs_1.default.writeFileSync(outputFiletoFolder, audioBuffer);
        }
    }
    if (SSPMResult.coverBool === 1) {
        const coverBuffer = buffer.subarray(Number(SSPMResult.coverDataOffset), Number(SSPMResult.coverDataOffset) + Number(SSPMResult.coverDataLength));
        const outputFiletoFolder = outputPath('cover.png');
        fs_1.default.writeFileSync(outputFiletoFolder, coverBuffer);
        // return 'audio.mp3'
    }
    return { SSPMResult };
}
const { SSPMResult } = parseSSPM(filePath);
const [SSPMArtist, SSPMTitle] = SSPMResult.mapName.split(' - ');
// let SSPMDifficulty: string = SSPMResult.customDataObject ? SSPMResult.customDataObject[0].customData.longUTF8String : Difficulties[SSPMResult.difficulty];
let SSPMDifficulty = SSPMResult.customDataArrayLength > 0 ? SSPMResult.customDataObject[0].customData.longUTF8String : dataTypes_1.Difficulties[SSPMResult.difficulty];
console.log(SSPMResult.customDataArrayLength);
let SSPMMappers = [];
let notes = [];
let prevMs = 0;
for (let i = 0; i < SSPMResult.mappers.length; i++) {
    SSPMMappers.push(SSPMResult.mappers[i].mapper);
}
for (let i = 0; i < SSPMResult.markerCount; i++) {
    let sspmTime = SSPMResult.markerObject[i].time;
    let sspmX = SSPMResult.markerObject[i].markerData[0].markerType.noteObject.x - 1; // x - 1 to center at 0,0
    let sspmY = 1 - SSPMResult.markerObject[i].markerData[0].markerType.noteObject.y; // 1 - y to flip & center at 0,0
    let sspmDelta = sspmTime - prevMs;
    prevMs = sspmTime;
    notes.push({
        time: sspmDelta,
        x: sspmX,
        y: sspmY
    });
}
let noteList = notes.flatMap(note => [note.time, note.x, note.y]);
const SSPM2rhymGlobalMetadata = {
    version: 1, // .rhym v1
    artist: SSPMArtist,
    title: SSPMTitle,
    difficulties: [SSPMDifficulty]
};
const SSPM2rhymDifficultyMetadata = {
    artist: SSPMArtist,
    title: SSPMTitle,
    mappers: SSPMMappers,
    noteCount: SSPMResult.markerCount
};
const SSPM2rhymObjectData = {
    noteFields: 3,
    noteList: noteList
};
// console.log(noteList)
const outputGlobalMetadatatoFolder = outputPath('metadata.json');
const outputDifficultyMetadatatoFolder = outputPath(SSPMDifficulty + '/metadata.json');
const outputobjectDatatoFolder = outputPath(SSPMDifficulty + '/object.json');
const globalMetadata = JSON.stringify(SSPM2rhymGlobalMetadata, undefined, 2);
const difficultyMetadata = JSON.stringify(SSPM2rhymDifficultyMetadata, undefined, 2);
const objectData = JSON.stringify(SSPM2rhymObjectData); //  we arent indenting the object json to save space
fs_1.default.writeFileSync(outputGlobalMetadatatoFolder, globalMetadata, 'utf-8');
var difficultydirPath = './src/output/' + SSPMDifficulty;
fs_1.default.mkdirSync(difficultydirPath, { recursive: true });
fs_1.default.writeFileSync(outputDifficultyMetadatatoFolder, difficultyMetadata, 'utf-8');
fs_1.default.writeFileSync(outputobjectDatatoFolder, objectData, 'utf-8');
// console.log(JSON.stringify(SSPM2rhymGlobalMetadata))
// const testJSON = JSON.stringify(SSPM, bigIntReplacer, 2);
// const outputFiletoFolder = outputPath('SSPMv2Compiled.json')
// fs.writeFileSync(outputFiletoFolder, testJSON, 'utf-8');
// console.log(JSON.stringify(test));
//# sourceMappingURL=index.js.map