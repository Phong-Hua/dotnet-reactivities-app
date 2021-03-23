import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/stores';
import { observer } from 'mobx-react-lite';
import { useHistory, useParams } from 'react-router';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import {v4 as uuid} from 'uuid';
import { Link } from 'react-router-dom';

function ActivityForm() {
    const history = useHistory();
    const { activityStore } = useStore();
    const { updateActivity, createActivity, loadingInitial, loadActivity } = activityStore;
    const { id } = useParams<{ id: string }>();
    
    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: '',
    });

    useEffect(() => {
        if (id) {
            loadActivity(id)
            .then(activity => {
                if (activity)
                    setActivity(activity);
            })
        }
        // else
        //     setActivity(emptyActivity);
    }, [id, loadActivity])



    function handleSubmit() {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(()=> {
                history.push(`/activities/${newActivity.id}`)
            })
        } else {
            updateActivity(activity).then(()=>{
                history.push(`/activities/${activity.id}`)
            })
        }
    }


    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value })
    }


    if (loadingInitial)
        return <LoadingComponent content='Loading activity...'/>

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={(e) => handleInputChange(e)} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={(e) => handleInputChange(e)} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={(e) => handleInputChange(e)} />
                <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={(e) => handleInputChange(e)} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={(e) => handleInputChange(e)} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={(e) => handleInputChange(e)} />
                <Button loading={loadingInitial} floated='right' positive type='submit' content='Submit' />
                <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);