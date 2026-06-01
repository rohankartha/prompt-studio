

export type DatasetRow = {
    input: string;
    expectedOutput: string;
};





export type PromptNameAndVersions = {
    promptName: string;
    versions: {
        id: string,
        version: number
    }[];
}









export type DatasetIdsAndNames = {
    id: string,
    name: string
};