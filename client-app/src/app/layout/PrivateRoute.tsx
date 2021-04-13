import React from 'react';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import {useStore} from '../stores/stores';

interface Props extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

export default function PrivateRoute({component: Component, ...rest} : Props) {
    const {userStore: {isLoggedIn}} = useStore();
    return (
        <Route
            {...rest}
            // if they login, route them to the route, otherwise, redirect them to home page
            render={(props) => isLoggedIn? <Component {...props}/> : <Redirect to='/'/>}
        />
    )
}