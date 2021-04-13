import React, { useEffect, useState, } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/stores';
import { observer } from 'mobx-react-lite';
import ActivityFilters from './ActivitiyFilters';
import { PagingParams } from '../../../app/models/pagination';
import ActivityListItemPlaceholder from './ActivityListItemPlaceHolder';

function ActionDashboard() {
    const { activityStore } = useStore();
    const { activitiesRegistry, loadActivities, setPagingParams, pagination } = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    useEffect(() => {
        if (activitiesRegistry.size <= 1)
            loadActivities();
    }, [loadActivities, activitiesRegistry])  // passing activityStore as an array of dependencies to avoid looping infinitely

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingNext(false))
    }

    return (
        <Grid>
            <Grid.Column width='10'>
                {activityStore.loadingInitial && !loadingNext
                    ? (
                        <>
                            <ActivityListItemPlaceholder />
                            <ActivityListItemPlaceholder />
                        </>
                    )
                    : (
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleGetNext}
                            hasMore={!loadingNext && !!pagination /* make sure pagination is there*/
                                && pagination.currentPage < pagination.totalPages}
                            initialLoad={false}
                        >
                            <ActivityList />
                        </InfiniteScroll>
                    )
                }
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActionDashboard);