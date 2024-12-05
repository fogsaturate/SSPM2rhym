import { Parser } from 'binary-parser';

const noteType = new Parser()
    .uint8('noteStorageType') // bool that decides if its quantum or not
    .choice('noteObject', {
        tag: 'noteStorageType',
        choices: {
            0: new Parser()
                .uint8('x') // 1 byte integer for position
                .uint8('y'),
            1: new Parser()
                .floatle('x') // 4 byte float for position
                .floatle('y')
        }
    })

const longUTF8Type = new Parser().uint32le('longUTF8StringLength').string('longUTF8String', {length: 'longUTF8StringLength', encoding: 'utf8'});

export const dataTypes = {
    longUTF8Type,
    noteType
};

export interface MarkerDefinition {
    markerDefinitionIDLength: number;
    markerDefinitionID: string;
    markerDefinitionDataType: number;
    markerDefinitionEnd: number;
}

export enum Difficulties {
    'N/A' = 0,
    'Easy' = 1,
    'Medium' = 2,
    'Hard' = 3,
    'Logic' = 4,
    'Tasukete' = 5
};

