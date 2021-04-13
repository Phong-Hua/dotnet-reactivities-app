import { observer } from 'mobx-react-lite';
import {Tab} from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import ProfilePhotos from './ProfilePhotos';
import ProfileAbout from './ProfileAbout';
import ProfileFollowings from './ProfileFollowings';
import { useStore } from '../../app/stores/stores';
import ProfileActivities from './ProfileActivities';

interface Props {
    profile: Profile;
}

export default observer(function ProfileContent({profile} : Props) {

    const {profileStore} = useStore();

    const panes = [
        {menuItem: 'About', render: () => <ProfileAbout profile={profile} />},
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />},
        {menuItem: 'Events', render: () => <ProfileActivities>Events Content</ProfileActivities>},
        {menuItem: 'Followers', render: () => <ProfileFollowings/>},
        {menuItem: 'Following', render: () => <ProfileFollowings/>}
    ] ; // allow us to create menu on right handside and content on left handside
    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)}
        >
        </Tab>
    )
})