import fs from 'fs';
import archiver from 'archiver';
import { Parser } from 'binary-parser';
import { rhymGlobalMetadata , rhymDifficultyMetadata, rhymObjectData, rhymNote } from './rhymInterface';
import { Difficulties } from './dataTypes';
import { SSPMParser } from './sspmParser';
import path from 'path';

const filePath = path.join(__dirname, '../src/input/xr_attractor_dimension.sspm');

function outputPath(outputFilename: string): string {
    const outputFolder = path.join(__dirname, '../src/output')
    return path.join(outputFolder, outputFilename)
}

function bigIntReplacer(key: string, value: any) {
    if (typeof value === 'bigint') {
      return value.toString(); // You can also choose to return Number(value) if needed
    }
    return value; // Leave other values unchanged
};

function audioFormatChecker(buffer: any) {
    const audioHeaderParser = new Parser()
        .string('',{length: 4, encoding: 'utf8'}) // OGG headers have OggS as the header

    const audioOutput = audioHeaderParser.parse(buffer);

    // console.log(audioOutput)

    return audioOutput;
};

function parseSSPM(filePath: any) {
    const buffer = fs.readFileSync(filePath);
    const SSPMResult = SSPMParser.parse(buffer);

    if (SSPMResult.audioBool === 1) {
        const audioBuffer = buffer.subarray(Number(SSPMResult.audioDataOffset), Number(SSPMResult.audioDataOffset) + Number(SSPMResult.audioDataLength))
        
        const { audioOutput } = audioFormatChecker(audioBuffer)

        if (audioOutput === 'OggS') {
            const outputFiletoFolder = outputPath('audio.ogg')
            fs.writeFileSync(outputFiletoFolder, audioBuffer);
        }
        else {
            const outputFiletoFolder = outputPath('audio.mp3')
            fs.writeFileSync(outputFiletoFolder, audioBuffer);
        }
    }
    if (SSPMResult.coverBool === 1) {
        const coverBuffer = buffer.subarray(Number(SSPMResult.coverDataOffset), Number(SSPMResult.coverDataOffset) + Number(SSPMResult.coverDataLength))
        const outputFiletoFolder = outputPath('cover.png')
        fs.writeFileSync(outputFiletoFolder, coverBuffer);
        // return 'audio.mp3'
    }

    return {SSPMResult}
}

const {SSPMResult} = parseSSPM(filePath)

const [SSPMArtist, SSPMTitle] = SSPMResult.mapName.split(' - ')
// let SSPMDifficulty: string = SSPMResult.customDataObject ? SSPMResult.customDataObject[0].customData.longUTF8String : Difficulties[SSPMResult.difficulty];
let SSPMDifficulty: string = SSPMResult.customDataArrayLength > 0 ? SSPMResult.customDataObject[0].customData.longUTF8String : Difficulties[SSPMResult.difficulty];

console.log(SSPMResult.customDataArrayLength)

let SSPMMappers: string[] = [];
let notes: rhymNote[] = []
let prevMs: number = 0;

for (let i = 0; i < SSPMResult.mappers.length; i++) {
    SSPMMappers.push(SSPMResult.mappers[i].mapper)
}

for (let i = 0; i < SSPMResult.markerCount; i++) {
    let sspmTime = SSPMResult.markerObject[i].time
    let sspmX = SSPMResult.markerObject[i].markerData[0].markerType.noteObject.x - 1 // x - 1 to center at 0,0
    let sspmY = 1 - SSPMResult.markerObject[i].markerData[0].markerType.noteObject.y // 1 - y to flip & center at 0,0

    let sspmDelta = sspmTime - prevMs
    prevMs = sspmTime
    
    notes.push({
        time: sspmDelta,
        x: sspmX,
        y: sspmY
    })
}

let noteList: number[] = notes.flatMap(note => [note.time, note.x, note.y]);

const SSPM2rhymGlobalMetadata: rhymGlobalMetadata = {
    version: 1, // .rhym v1
    artist: SSPMArtist,
    title: SSPMTitle,
    difficulties: [SSPMDifficulty]
};

const SSPM2rhymDifficultyMetadata: rhymDifficultyMetadata = {
    artist: SSPMArtist,
    title: SSPMTitle,
    mappers: SSPMMappers,
    noteCount: SSPMResult.markerCount
};

const SSPM2rhymObjectData: rhymObjectData = {
    noteFields: 3,
    noteList: noteList
}

// console.log(noteList)

const outputGlobalMetadatatoFolder = outputPath('metadata.json')
const outputDifficultyMetadatatoFolder = outputPath(SSPMDifficulty + '/metadata.json')
const outputobjectDatatoFolder = outputPath(SSPMDifficulty + '/object.json')

const globalMetadata = JSON.stringify(SSPM2rhymGlobalMetadata, undefined, 2)
const difficultyMetadata = JSON.stringify(SSPM2rhymDifficultyMetadata, undefined, 2)
const objectData = JSON.stringify(SSPM2rhymObjectData) //  we arent indenting the object json to save space

fs.writeFileSync(outputGlobalMetadatatoFolder, globalMetadata, 'utf-8');

var difficultydirPath = './src/output/' + SSPMDifficulty;
fs.mkdirSync(difficultydirPath, { recursive: true });

fs.writeFileSync(outputDifficultyMetadatatoFolder, difficultyMetadata, 'utf-8');
fs.writeFileSync(outputobjectDatatoFolder, objectData, 'utf-8');


// export to .rhym


function rhymFileName(arr: string[], str2: string, str3: string): string {
    const combinedMetadata = [SSPMMappers, SSPMArtist, SSPMTitle].join(" "); // Combine all into one string with spaces
    return combinedMetadata.replace(/ /g, "_");              // Replace all spaces with underscores
}


const output = fs.createWriteStream('./src/' + rhymFileName(SSPMMappers, SSPMArtist, SSPMTitle) + '.rhym');
const archive = archiver('zip');

archive.pipe(output)

archive.directory('./src/output', false);

archive.finalize();