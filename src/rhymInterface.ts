// export class rhymGlobalMetadata {
//     version: number;
//     artist: string;
//     romanizedArtist?: string;
//     title: string;
//     romanizedTitle?: string;
//     difficulties: string[];

//     constructor(
//         version: number,
//         artist: string,
//         romanizedArtist: string,
//         title: string,
//         romanizedTitle: string,
//         difficulties: string[]
//     ) {
//         this.version = version
//         this.artist = artist
//         this.romanizedArtist = romanizedArtist
//         this.title = title
//         this.romanizedTitle = romanizedTitle
//         this.difficulties = difficulties
//     }
// }

// export class rhymDifficultyMetadata {
//     version: number;
//     artist: string; // optional
//     romanizedArtist: string; // optional
//     title: string; // optional
//     romanizedTitle: string; // optional
//     mappers: string[];
//     noteCount: number;

//     constructor(
//         version: number,
//         artist: string,
//         romanizedArtist: string,
//         title: string,
//         romanizedTitle: string,
//         mappers: string[], // 1 mapper every difficulty
//         noteCount: number
//     ) {
//         this.version = version
//         this.artist = artist
//         this.romanizedArtist = romanizedArtist
//         this.title = title
//         this.romanizedTitle = romanizedTitle
//         this.mappers = mappers
//         this.noteCount = noteCount
//     }
// }

// export class rhymObjectData {
//     noteFields: number; // note properties, time, x, y
//     noteList: number[];


//     constructor(
//         noteFields: number,
//         noteList: number[]
//     ) {
//         this.noteFields = noteFields
//         this.noteList = noteList
//     }
// }

// export class rhymNote {
//     time: number;
//     x: number;
//     y: number;

//     constructor(
//         time: number, // milliseconds, difference between current note and last note
//         x: number,
//         y: number
//     ) {
//         this.time = time
//         this.x = x
//         this.y = y
//     }
// }

export interface rhymGlobalMetadata {
    version: number;
    artist: string;
    romanizedArtist?: string; // for japanese artists (optional)
    title: string;
    romanizedTitle?: string; // for japanese titles (optional)
    difficulties: string[];
}

export interface rhymDifficultyMetadata {
    artist: string;
    romanizedArtist?: string; // for japanese artists (optional)
    title: string;
    romanizedTitle?: string; // for japanese titles (optional)
    mappers: string[];
    noteCount: number; // easier for parsing reasons
}

export interface rhymObjectData {
    noteFields : number; // amount of note properties (future proofing for future additions to notes instead of a simple time, x, y)
    noteList : number[];
}

export interface rhymNote {
    time: number; // milliseconds, difference between current note and last note
    x: number;
    y: number;
}