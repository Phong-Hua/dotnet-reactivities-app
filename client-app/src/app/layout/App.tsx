import React from 'react';
import { Container, } from 'semantic-ui-react';

import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetail';

function App() {
  const location = useLocation();

  return (
    <>
      <Route path='/' exact component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <Container>
              <NavBar />
              <Container style={{ marginTop: '7em', }}>
                <Route path='/activities' exact component={ActivityDashboard} />
                <Route key={location.key} path={['/createActivity', '/manage/:id']} exact component={ActivityForm} />
                <Route path='/activities/:id' exact component={ActivityDetails} />
              </Container>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
