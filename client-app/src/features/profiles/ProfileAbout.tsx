import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Grid, Header, Item, Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/stores';
import ProfileForm from './ProfileForm';

interface Props {
    profile: Profile
}

export default observer( function ProfileAbout({profile} : Props) {

    const { profileStore : {isCurrentUser} } = useStore();

    const [editProfileMode, setEditProfileMode] = useState(false);

    const switchEditMode = () => {
        setEditProfileMode(!editProfileMode);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='user' floated='left' content={`About ${profile?.displayName}`} />
                    {
                        isCurrentUser && <Button
                            floated='right'
                            content= {editProfileMode ? 'Cancel' : 'Edit Profile'}
                            basic
                            onClick={switchEditMode}
                        />
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {
                        editProfileMode 
                        ? (<ProfileForm profile={profile} switchEditMode={switchEditMode}/>) 
                        : (<Item>
                            <Item.Description style={{'whiteSpace': 'pre-wrap'}} content={profile?.bio} />
                        </Item>)
                    }
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})