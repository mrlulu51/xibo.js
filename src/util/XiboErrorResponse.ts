import { AxiosResponse } from "axios";

export interface XiboErrorResponse {
    error: {
        message: string;
        code: number;
        data: XiboErrorData;
    }
}

export interface XiboErrorData {
    [property: string]: string;
}

export function threatError(response: AxiosResponse): never {
    if(response.data.message) throw new Error(response.data.message);
    throw new Error(response.statusText);
}