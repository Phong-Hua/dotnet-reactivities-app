<Popup
    hoverable
    key={attendee.username}
    trigger={
        <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
            <Image size='mini' circular src='/assets/user.png' />
        </List.Item>
    }
>
    <Popup.Content>
        <ProfileCard profile={attendee} />
    </Popup.Content>
</Popup>