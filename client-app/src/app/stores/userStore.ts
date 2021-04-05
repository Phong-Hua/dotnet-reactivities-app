import {makeAutoObservable, runInAction} from 'mobx';
import { User, UserFormValues } from "../models/user";
import agent from '../../app/api/agent';
import { store } from './stores';
import {history} from '../../index';

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this)
    }

    // compute property
    get isLoggedIn() {
        return !!this.user; // if user is null no, otherwise yes
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            history.push('/activities');
            store.modalStore.closeModal();
        }
        catch (error) {
            throw error;
        }
    }
    
    logout = () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        runInAction(() => this.user = null);
        history.push('/');
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        } catch (error) {
            console.log(error);
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            history.push('/activities');
            store.modalStore.closeModal();
        }
        catch (error) {
            throw error;
        }
    }

    setImage = (image : string) => {
        if (this.user) {
            this.user.image = image;
        }
    }
}