import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

export interface RestApiResponseError {
    code: string;
    message: string;
}

export interface RestApiResponse<T> {
    success: boolean;
    errors: RestApiResponseError[];
    result: T;
}

export default class RestApi {
    public http: AxiosInstance;

    constructor(baseURL: string, tokenProvider?: any, version?: string) {
        const basePath = baseURL.endsWith('/') ? baseURL.substring(0, baseURL.length - 1) : baseURL;
        this.http = axios.create({
            baseURL: version ? `${basePath}/${version}` : basePath,
        });

        if (tokenProvider) {
            this.http.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
                config.headers.common = {Authorization: 'Bearer ' + tokenProvider()};
                return config;
            });
        }

        this.http.interceptors.response.use(undefined, this.errorHandler);
    }

    public errorHandler(error: any) {
        return Promise.resolve(error);
    }
}
