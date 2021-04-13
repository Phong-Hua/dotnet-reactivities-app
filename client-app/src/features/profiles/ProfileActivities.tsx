import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import { format } from 'date-fns';
import { useStore } from '../../app/stores/stores';
import { Link } from 'react-router-dom';

export default observer(function ProfileActivities() {

    const { profileStore } = useStore();

    const { userActivities, loadActivities, loadingActivities } = profileStore;

    const panes = [
        { menuItem: 'Future Events', pane: { key: 'future' } },
        { menuItem: 'Past Events', pane: { key: 'past' } },
        { menuItem: 'Hosting', pane: { key: 'hosting' } },
    ]

    useEffect(() => {
        loadActivities('future')
    }, [loadActivities])

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='calendar' content='Activities' />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        menu={{ secondary: true, pointing: true }}
                        menuPosition='left'
                        panes={panes}
                        onTabChange={(e, data) => loadActivities(panes[data.activeIndex as number].pane.key)}
                    >
                    </Tab>
                    <br />
                    <Card.Group itemsPerRow={4}>
                        {
                            userActivities.map(activity => (
                                <Card
                                    key={activity.id}
                                    as={Link}
                                    to={`/activities/${activity.id}`}
                                >
                                    <Image src={`/assets/categoryImages/${activity.category}.jpg`}
                                        style={{ minHeight: 100, objectFit: 'cover' }}
                                    />
                                    <Card.Content>
                                        <Card.Header content={activity.title} textAlign='center' />
                                        <Card.Meta textAlign='center'>
                                            <div>{format(new Date(activity.date), 'do LLL')}</div>
                                            <div>{format(new Date(activity.date), 'h:mm a')}</div>
                                        </Card.Meta>
                                    </Card.Content>
                                </Card>
                            ))
                        }
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )


})