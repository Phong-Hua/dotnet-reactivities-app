import { observer } from 'mobx-react-lite';
import { Grid, Tab, Header, Card } from 'semantic-ui-react';
import { useStore } from '../../app/stores/stores';
import ProfileCard from './ProfileCard';

export default observer(function ProfileFollowings() {

    const { profileStore : {followings, loadingFollowing, activeTab} } = useStore();

    return (
        <Tab.Pane loading={loadingFollowing}>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='user' content={activeTab === 3 ? 'Followers' : 'Following'} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {followings.map(profile => (
                            <ProfileCard key={profile.username} profile={profile} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})