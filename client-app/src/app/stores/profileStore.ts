import { Photo, Profile, UserActivity } from '../models/profile';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import agent from '../api/agent';
import { store } from './stores';

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    deleting = false;
    followings: Profile[] = []; // list of following or followers
    loadingFollowing = false;
    activeTab = 0;  // we use for reaction
    userActivities: UserActivity[] = [];
    loadingActivities= false;

    
    constructor() {
        makeAutoObservable(this);

        // config reaction
        reaction(
            () => this.activeTab,
            activeTab => {
                if(activeTab === 3 || activeTab === 4) {
                    const predicate = (activeTab === 3) ? "followers" : "following";
                    this.listFollowings(predicate);
                } else {
                    this.followings = [];
                }
            },
            
        );

        
    }

    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loadingProfile = false;
            })
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => this.uploading = false)
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            // update userstore
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false)
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.deleting = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(p => p.id !== photo.id);
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.deleting = false);
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        try {
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {

                if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName);
                }
                if (this.profile) {
                    this.profile = { ...this.profile, ...profile };
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username, following);
            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                if(this.profile && this.profile.username === store.userStore.user?.username) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }
                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.following = !profile.following;
                        following ? profile.followersCount++ : profile.followersCount--;
                    }
                })
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false)
        }
    }

    listFollowings = async (predicate: string) => {
        if (!this.profile) return;

        this.loadingFollowing = true;
        try {
            const response = await agent.Profiles.listFollowings(this.profile.username, predicate);
            runInAction(() => {
                this.followings = response;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingFollowing = false)
        }
    }

    loadActivities = async (predicate: string) => {
        if (!this.profile) return;

        this.loadingActivities = true;
        try {
            const activities = await agent.Profiles.getUserActivities(this.profile?.username, predicate);
        
            runInAction(() => {
                this.userActivities = activities;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingActivities = false)
        }
    }
}