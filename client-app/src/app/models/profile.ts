import { User } from "./user";

export interface Profile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    photos? : Photo[];
    followersCount: number;
    followingCount: number;
    following: boolean;
}

export class  Profile implements Profile {  // no problem if we are using a same name for class and profile
    constructor(user: User) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}

export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
}

export class ProfileFormValues {
    displayName: string = '';
    bio?: string;

    constructor(profile?: ProfileFormValues) {
        if (profile) {
            this.displayName = profile.displayName;
            this.bio = profile.bio ?? this.bio;
        }
    }
}