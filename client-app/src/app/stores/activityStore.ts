import {makeAutoObservable, runInAction} from 'mobx';
import agent from '../api/agent';
import { Activity } from '../models/activity';

export default class ActivityStore {

    activitiesRegistry = new Map<String, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate () {
        return Array.from(this.activitiesRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const response = await agent.Activities.list();
            response.forEach(x => {
                this.setActivity(x);
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.loadingInitial = false;
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id : string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.selectedActivity = activity;
                this.setActivity(activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity : Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activitiesRegistry.set(activity.id, activity);
    }

    private getActivity = (id : string) => {
        return this.activitiesRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activitiesRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity : Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activitiesRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id : string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activitiesRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}