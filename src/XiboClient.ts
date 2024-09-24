import { RequestHandler } from "./util/RequestHandler";

export class XiboClient {

    private baseURL: string;
    private requestHandler: RequestHandler;

    public constructor(baseURL: string, requestHandler: RequestHandler) {
        this.baseURL = baseURL;
        this.requestHandler = requestHandler;
    }

    public async about(): Promise<any> {
        return await this.requestHandler.requestGet('/about');
    }

    public getRequestHandler(): RequestHandler {
        return this.requestHandler;
    }

    public getBaseURL(): string {
        return this.baseURL;
    }
}