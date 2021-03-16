import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Container, Header, List } from 'semantic-ui-react';

function App() {

  const [activities, setActivities] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/activities')
      .then(response => {

        setActivities(response.data)
        console.log('data:::', response.data)
      })
  }, [])  // passing an array of dependencies to avoid looping infinitely

  return (
    <Container>
        <Header as='h2' icon='users' content='Reactivites' />
        <List>
          {
            activities.map((activity: any) => <List.Item key={activity.id}>{activity.title}</List.Item>)
          }
        </List>
    </Container>
  );
}

export default App;
