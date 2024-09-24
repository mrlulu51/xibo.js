import { RequestHandler } from "../util/RequestHandler";
import { AuthenticationGrantType, RequestAPISubdomain } from "../util/types";
import { threatError } from "../util/XiboErrorResponse";
import { XiboClient } from "../XiboClient";

export interface XiboAuthenticationCredentials {
    client_id: string;
    client_secret: string;
    grant_type: AuthenticationGrantType
}

export interface XiboAuthenticated {
    access_token: string;
    token_type: string;
    expires_in: string;
}

export class Session {

    private baseURL: string;
    private credentials: XiboAuthenticationCredentials;
    private requestHandler: RequestHandler;

    public constructor({ ...credentials }: XiboAuthenticationCredentials, baseURL: string) {
        this.credentials = credentials;
        this.requestHandler = new RequestHandler(baseURL, RequestAPISubdomain.AUTHORIZATION);
        this.baseURL = baseURL;
    }

    public async authenticate(): Promise<XiboClient> {
        if(this.getToken()) return new XiboClient(this.baseURL, this.setTokenToRequestHandler(this.getToken(), new RequestHandler(this.baseURL)));

        const endpoint = '/access_token';
        const response = await this.requestHandler.postNoEnvelope<
            XiboAuthenticated,
            XiboAuthenticationCredentials
        >(endpoint, this.credentials);

        if(response.status === 200) {
            this.setToken(response.data.access_token);
            return new XiboClient(this.baseURL, this.setTokenToRequestHandler(this.getToken(), new RequestHandler(this.baseURL)));
        }

        threatError(response);
    }

    private setToken(token: string, requestHandler?: RequestHandler): void {
        this.requestHandler.getAxiosHeaders().common.Authorization = `Bearer ${token}`;
    }

    private setTokenToRequestHandler(token: string, requestHandler: RequestHandler): RequestHandler {
        requestHandler.getAxiosHeaders().common.Authorization = `Bearer ${this.getToken()}`
        return requestHandler;
    }

    private getToken(): string {
        return this.requestHandler.getAxiosHeaders().common.Authorization;
    }

    private removeToken(): void {
        delete this.requestHandler.getAxiosHeaders().common['Authorization'];
    }
}