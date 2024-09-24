import axios, { AxiosInstance, AxiosPromise } from 'axios';
import qs from 'qs';
import { RequestAPISubdomain } from './types';
import { threatError, XiboErrorResponse } from './XiboErrorResponse';
import { CMSResponse } from './Entities';

export class RequestHandler {

    private baseUrl: string;
    private axios: AxiosInstance;

    public constructor(baseURL: string, subdomain?: RequestAPISubdomain, routeCompletion?: string) {
        this.baseUrl = baseURL;
        this.axios = axios.create({
            baseURL: `${this.baseUrl}/api/${subdomain ? subdomain + `/${routeCompletion ? routeCompletion : ''}` : '/'}`,
            timeout: 10000,
            headers: {
                common: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json'
                },
            },
            validateStatus: (status) => {
                return status < 500
            }
        });
    }

    public postNoEnvelope<R, D = null>(endpoint: string, data?: D): AxiosPromise<R & XiboErrorResponse> {
        return this.axios({
            method: 'POST',
            url: endpoint,
            data: qs.stringify(data) || undefined
        });
    }

    public async requestGet<R>(endpoint: string): Promise<R> {
        const response = await this.get<CMSResponse<R>>(endpoint);
        if(response.data.success) return response.data.data;
        threatError(response);
    }

    public get<R, C = null>(endpoint: string, criteria?: C): AxiosPromise<R> {
        const envelope = {
            ...criteria,
            envelope: 1
        };

        return this.axios({
            method: 'GET',
            url: `${endpoint}?${qs.stringify(envelope, { encode: false, skipNulls: true })}`
        });
    }

    public getAxios(): AxiosInstance {
        return axios;
    }

    public getAxiosHeaders(): any {
        return axios.defaults.headers;
    }

    public createSubRouteAxiosInstance(subdomain: RequestAPISubdomain, routeCompletion?: string): RequestHandler {
        return new RequestHandler(this.baseUrl, subdomain, routeCompletion);
    }
}