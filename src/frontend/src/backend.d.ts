import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Exercise {
    id: string;
    title: string;
    order: bigint;
    video: ExternalBlob;
    image: ExternalBlob;
}
export interface backendInterface {
    addExercise(id: string, title: string, image: ExternalBlob, video: ExternalBlob, order: bigint): Promise<void>;
    find(id: string): Promise<Exercise>;
    getAllExercises(): Promise<Array<Exercise>>;
    getNextExercise(id: string): Promise<Exercise>;
    getPreviousExercise(id: string): Promise<Exercise>;
}
