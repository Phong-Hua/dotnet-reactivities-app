import {makeAutoObservable, runInAction} from 'mobx';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import {ChatComment} from '../models/comment';
import {store} from './stores';

export default class CommentStore {

    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null; // this is from signalR

    constructor() {
        makeAutoObservable(this);
    }

    // add method for create hubConnection
    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(`http://localhost:5000/chat?activityId=${activityId}`, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start().catch(error => console.log('Error establishing the connection: ', error));

            // we want to receive all comments for this activity
            this.hubConnection.on('LoadComments', (comments:ChatComment[] )=> {
                runInAction(() => {
                    comments.forEach(comment => {
                        // we are formating the comment.createAt receive from database to UTC
                        comment.createdAt = new Date(comment.createdAt + 'Z');
                    })
                    this.comments = comments;
                })
            })

            // add method for receive a comment
            this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt)
                    this.comments.unshift(comment)
                })
            })
        }
    }

    // add method for stop hub connection
    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error))
    }

    // we want to clear comment when user disconnect to an activity
    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values : any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke("SendComment", values); // SendComment need to match the method on our server
            // The server will send us "ReceiveComment" and we catched above
        } catch (error) {
            console.log(error);
        }
    }
}