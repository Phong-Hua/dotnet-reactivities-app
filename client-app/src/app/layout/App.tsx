import React, { useEffect, useState } from 'react';
import { Container, } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import LoadingComponent from '../layout/LoadingComponent';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';

function App() {

  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);  // set state like this, it is already know what type of editMode
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        const activities = response.map<Activity>(x => {
          return {
            ...x,
            'date': x.date.split('T')[0]
          }
        });
        setLoading(false);
        setActivities(activities)
      })
  }, [])  // passing an array of dependencies to avoid looping infinitely

  function handleSelectedActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectedActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  async function handleCreateOrEditActivity(activity: Activity) {
    setSubmitting(true);
    if (activity.id) {
      await agent.Activities.update(activity);
      setActivities([...activities.filter(x => x.id !== activity.id), activity])
    }
    else {
      activity.id = uuid();
      await agent.Activities.create(activity);
      setActivities([...activities, activity])
    }
    setSubmitting(false);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  async function handleDeleteActivity(id: string) {
    setDeleting(true);
    await agent.Activities.delete(id)
    setActivities([...activities.filter(x => x.id !== id)])
    setDeleting(false);
  }


  if (loading) return <LoadingComponent />

  return (
    <Container>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em', }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectedActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          deleting={deleting}
        />
      </Container>
    </Container>
  );
}

export default App;
