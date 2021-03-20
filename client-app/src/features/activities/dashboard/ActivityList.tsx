import React, { SyntheticEvent, useState } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
    activities: Activity[],
    selectActivity: (id: string) => void,
    deleteActivity: (id: string) => void,
    deleting: boolean,
}

export default function ActivityList({ activities, selectActivity, deleteActivity, deleting }: Props) {

    const [target, setTarget] = useState('');

    const handleDeleteActivity = (event : SyntheticEvent<HTMLButtonElement>) => {
        const activityId = event.currentTarget.name;
        
        setTarget(activityId);
        deleteActivity(activityId);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
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
                                    onClick={() => selectActivity(activity.id)}
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
                                    loading={deleting && target === activity.id}
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