import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import {Activity} from '../models/activity';
import {history} from '../../index';
import { store } from '../stores/stores';
import { User, UserFormValues } from '../models/user';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const sleep = (delay: number) => new Promise<void>((res) => {
    return setTimeout(res, delay)
})

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token)
        config.headers.Authorization = `Bearer ${token}`
    return config;
})

axios.interceptors.response.use(async respose => {
    await sleep(1000);
    return respose;
}, (error : AxiosError) => {    // error is for everything is not 2XX response
    const {data, status, config} = error.response!; // we know that include in error.response

    switch (status) {
        case 400:
            if( typeof data === 'string') { // this is to allow toast with bad request
                toast.error(data)
            }
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                history.push('/not-found');
            }
            if (data.errors) {  // if data contains errors object that is valid response from API
                const modalStateErrors = [];
                // we want to loop over all errors and put them into this array
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                // we want to throw this back into component
                throw modalStateErrors.flat();
            }
            break;
        case 401:
            toast.error('unauthorized');
            break;
        case 404:
            history.push('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error);
});

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    // url is type of string, body is type of object
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put <T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => axios.post<void>('/activities', activity),  // passing activity as in body
    update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`)
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const agent = {
    Activities,
    Account
}

export default agent;