import React, { useEffect, }  from 'react';
import {Grid} from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/stores';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';

function ActionDashboard() {
    const {activityStore} = useStore();
    const { activitiesRegistry, loadActivities } = activityStore;

    useEffect(() => {
        if (activitiesRegistry.size <= 1)
            loadActivities();
    }, [loadActivities, activitiesRegistry])  // passing activityStore as an array of dependencies to avoid looping infinitely
  
  
    if (activityStore.loadingInitial) return <LoadingComponent />
  
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActionDashboard);