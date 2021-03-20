import React from 'react';
import {Grid} from 'semantic-ui-react';
import {Activity} from '../../../app/models/activity';
import ActivityDetails from '../details/ActivityDetail';
import ActivityList from './ActivityList';
import ActivityForm from '../form/ActivityForm';

interface Props {
    activities: Activity[],
    selectedActivity: Activity | undefined,
    selectActivity: (id : string) => void,
    cancelSelectActivity: () => void,
    editMode: boolean,
    openForm: (id : string) => void,    // we are sure that we are passing id, so no need to | undefined
    closeForm: () => void,
    createOrEdit: (activity: Activity) => void,
    deleteActivity: (id : string) => void,
    submitting: boolean,
    deleting: boolean,
}

export default function ActionDashboard({activities, selectedActivity, 
        selectActivity, cancelSelectActivity, editMode, openForm, closeForm, createOrEdit, deleteActivity, submitting, deleting} : Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList 
                    activities={activities} 
                    selectActivity={selectActivity} 
                    deleteActivity={deleteActivity}
                    deleting={deleting}
                />
            </Grid.Column>
            <Grid.Column width='6'>
                {
                    selectedActivity && !editMode &&
                    <ActivityDetails 
                        activity={selectedActivity} 
                        cancelSelectActivity={cancelSelectActivity}
                        openForm={openForm}
                    />
                }
                {
                    editMode &&
                    <ActivityForm 
                        closeForm={closeForm} 
                        activity={selectedActivity}
                        createOrEdit={createOrEdit}
                        submitting={submitting}
                    />
                }
                
            </Grid.Column>
        </Grid>
    )
}