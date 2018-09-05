import axios, {AxiosInstance} from 'axios';

export default class RestApi {
    public http: AxiosInstance;

    constructor(baseURL: string, version?: string) {
        const basePath = baseURL.endsWith('/') ? baseURL.substring(0, baseURL.length - 1) : baseURL;
        this.http = axios.create({
            baseURL: version ? `${basePath}/${version}` : basePath,
        });

      //  this.http.interceptors.response.use(undefined, this.errorHandler);
    }

    public errorHandler(error: any) {
        return Promise.resolve(error);
    }
}
