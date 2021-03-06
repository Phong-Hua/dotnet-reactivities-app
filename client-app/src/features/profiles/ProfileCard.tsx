import {Card, Image, Icon} from 'semantic-ui-react';
import {observer} from 'mobx-react-lite';
import {Link} from 'react-router-dom';
import {Profile} from '../../app/models/profile';
import FollowButton from './FollowButton';


interface Props {
    profile: Profile;
}

export default observer(function ProfileCard({profile}: Props) {

    const shortBio = (profile.bio && profile.bio?.length > 40) ? profile.bio.slice(0, 40) +'...' : profile.bio;

    return (
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'}/>
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{shortBio}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user'/>
                {profile.followersCount <= 1 ? `${profile.followersCount} follower` : `${profile.followersCount} followers`}
                <FollowButton profile={profile}/>
            </Card.Content>
        </Card>
    )
})