import axios, {AxiosInstance} from 'axios';

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

    constructor(baseURL: string, version?: string, token?: string) {
        const basePath = baseURL.endsWith('/') ? baseURL.substring(0, baseURL.length - 1) : baseURL;
        this.http = axios.create({
            baseURL: version ? `${basePath}/${version}` : basePath,
        });

        if (token) {
            this.http.defaults.headers.common = {
                Authorization: 'Bearer ' + token,
            };
        }

        this.http.interceptors.response.use(undefined, this.errorHandler);
    }

    public errorHandler(error: any) {
        // console.error('errorHandler', error);
        return Promise.resolve(undefined);
    }
}
