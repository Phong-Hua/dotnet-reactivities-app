import {makeAutoObservable, reaction} from 'mobx';
import {ServerError} from '../models/serverError';

export default class CommonStore {
    error: ServerError | null = null;
    token: string | null = window.localStorage.getItem('jwt');
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        // config reaction
        // reaction is not called in the beginning. It is only called 
        // when token is changing, it will be called
        reaction(
            () => this.token,   // what we want to react
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token);
                }
                else {
                    window.localStorage.removeItem('jwt');
                }  
            }
        )
    }

    setServerError = (error: ServerError) => {
        this.error = error;
    }

    setToken = (token: string|null) => {
        this.token = token;
    }

    setAppLoaded= () => {
        this.appLoaded = true;
    }
}