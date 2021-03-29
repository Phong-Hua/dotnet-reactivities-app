import { Container} from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetail';
import TestError from '../../features/errors/TestError';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import { ToastContainer } from 'react-toastify';
import LoginForm from '../../features/users/LoginForm';

function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <Route path='/' exact component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <Container>
              <NavBar />
              <Container style={{ marginTop: '7em', }}>
                <Switch>  {/*Use switch so only one route is loaded at a time*/}
                  <Route path='/activities' exact component={ActivityDashboard} />
                  <Route key={location.key} path={['/createActivity', '/manage/:id']} exact component={ActivityForm} />
                  <Route path='/activities/:id' exact component={ActivityDetails} />
                  <Route path='/buggy' exact component={TestError} />
                  <Route path='/server-error' component={ServerError} />
                  <Route path='/login' component={LoginForm} />
                  <Route component={NotFound} />
                </Switch>
              </Container>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
