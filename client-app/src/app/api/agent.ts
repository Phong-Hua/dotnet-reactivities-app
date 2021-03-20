import axios, { AxiosResponse } from 'axios';
import {Activity} from '../models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const sleep = (delay: number) => new Promise<void>((res) => {
    return setTimeout(res, delay)
})

axios.interceptors.response.use(async respose => {
    await sleep(1000);
    return respose;
}, (error) => {
    return new Promise((res, rej) => {
        rej(error);
    })
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

const agent = {
    Activities
}

export default agent;