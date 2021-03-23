import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/stores';


function ActivityList() {

    const { activityStore } = useStore();
    const activities = activityStore.activitiesByDate;
    const [target, setTarget] = useState('');

    const handleDeleteActivity = (event : SyntheticEvent<HTMLButtonElement>) => {
        const activityId = event.currentTarget.name;
        
        setTarget(activityId);
        activityStore.deleteActivity(activityId);
    }

    
    return (
        <Segment>
            <Item.Group divided>
                {activities.length === 0 
                    ?(
                        <Item>
                            <Item.Content>No activities</Item.Content>
                        </Item>
                    )
                    :
                    activities.map(activity => (
                        <Item key={activity.id}>
                            <Item.Content>
                                <Item.Header as='a'>
                                    {activity.title}
                                </Item.Header>
                                <Item.Meta>
                                    {activity.date}
                                </Item.Meta>
                                <Item.Description>
                                    <div>{activity.description}</div>
                                    <div>{activity.city}, {activity.venue}</div>
                                </Item.Description>
                                <Item.Extra>
                                    <Button
                                        as={Link}
                                        to={`/activities/${activity.id}`}
                                        floated='right'
                                        content='View'
                                        color='blue'
                                    />
                                    <Button
                                        onClick={handleDeleteActivity}
                                        name={activity.id}
                                        floated='right'
                                        content='Delete'
                                        color='red'
                                        loading={activityStore.loading && target === activity.id}
                                    />
                                    <Label basic content={activity.category} />
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    ))
                    
                }
            </Item.Group>
        </Segment>
    )
}

export default observer(ActivityList);