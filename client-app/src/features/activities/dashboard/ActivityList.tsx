import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { Item, Header} from 'semantic-ui-react';
import { useStore } from '../../../app/stores/stores';
import ActivityListItem from './ActivityListItem';

function ActivityList() {

    const { activityStore } = useStore();
    const {groupedActivities} = activityStore;

    return (
        <>
            {groupedActivities.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                        {activities.length === 0 
                            ?(
                                <Item>
                                    <Item.Content>No activities</Item.Content>
                                </Item>
                            )
                            :
                            activities.map(activity => (
                                <ActivityListItem key={activity.id} activity={activity} />
                            ))
                        }
                </Fragment>
            ))}
        </>
    )
}

export default observer(ActivityList);