import { ErrorMessage, Form, Formik } from 'formik';
import { Header, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Button } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/stores';

export default observer(function LoginForm() {
    const {userStore} = useStore();
    return (
        <Formik 
            initialValues={{email: '', password: '', error: null}}  // error help us to display errors in the form
            onSubmit={(values, {setErrors}) => userStore.login(values)
                .catch(error => setErrors({error: 'Invalid email or password'}))}
        >
            {({handleSubmit, isSubmitting, errors}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Login to Reactivities' color='teal' textAlign='center'/>
                    <MyTextInput name='email' placeholder='Email'/>
                    <MyTextInput name='password' placeholder='Password' type='password'/>
                    <ErrorMessage 
                        name='error' render={()=> 
                        <Label style={{marginBottom: 10}} basic color='red' content={errors.error}/>}
                    />
                    <Button loading={isSubmitting} positive content='Login' type='submit' fluid />
                </Form>
            )}
        </Formik>
    )
})