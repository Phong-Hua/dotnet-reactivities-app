import { Reveal, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Profile } from '../../app/models/profile';
import {useStore} from '../../app/stores/stores';
import { SyntheticEvent } from 'react';

interface Props {
    profile: Profile;
}

export default observer(function FollowButton({ profile }: Props) {

    const {profileStore, userStore} = useStore();
    const {updateFollowing, loading} = profileStore;

    if (userStore.user?.username === profile.username) return null;

    function handleFollow(e : SyntheticEvent, username: string, following: boolean){
        e.preventDefault();
        if (following)
            updateFollowing(username, false);
        else
            updateFollowing(username, true);
    }

    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button 
                    fluid color='teal' 
                    content={ profile.following ? 'Following' : 'Not Following' } 
                />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button
                    fluid
                    basic
                    loading={loading}
                    color={profile.following ? 'red' : 'green'}
                    content={profile.following ? 'Unfollow' : 'Follow'}
                    onClick={e => handleFollow(e, profile.username, profile.following)}
                />
            </Reveal.Content>
        </Reveal>
    )
})
