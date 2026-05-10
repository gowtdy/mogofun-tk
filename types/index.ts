export interface Model {
    name: string;
    gender: string;
    author: string;
    modelid: string;
    modelicon: string;
    exampleAudio: string;
    cover_catid?: string;
    cover_modelname?: string;
}

export interface VoiceModel {
    language: string;
    languageid: string;
    options: Model[];
}

export interface Category {
    catname: string;
    catid: string;
    options: Model[];
} 