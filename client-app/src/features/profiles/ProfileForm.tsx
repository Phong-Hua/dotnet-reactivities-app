import React, { useEffect, useState } from 'react';
import { Button, Segment } from 'semantic-ui-react';
import { Formik, Form, validateYupSchema } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import MyTextArea from '../../app/common/form/MyTextArea';
import { Profile, ProfileFormValues } from '../../app/models/profile';
import { useStore } from '../../app/stores/stores';
import * as Yup from 'yup';

interface Props {
    profile: Profile,
    switchEditMode : () => void;
}

export default function ProfileForm({profile, switchEditMode: switchEditProfileMode} : Props) {

    const {profileStore : {updateProfile}} = useStore();
    const [profileValues, setProfileValues] = useState<ProfileFormValues>(new ProfileFormValues());
    
    const validationSchema = Yup.object({
        displayName: Yup.string().required('The display name is required')
    })

    useEffect(() => {
        if (profile) {
            setProfileValues(new ProfileFormValues(profile));
        }
    }, [profile])

    const handleFormSubmit = (values : ProfileFormValues) => {
        updateProfile(values).then(() => {
            switchEditProfileMode();
        })
    }

    return (
            <Formik
                validationSchema={validationSchema}
                initialValues={profileValues}
                enableReinitialize
                onSubmit={(values) => handleFormSubmit(values)}>
                {
                    ({ handleSubmit, isValid, isSubmitting, dirty }) => (
                        
                        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                            <MyTextInput name='displayName' placeholder='Display Name' />
                            <MyTextArea rows={6} name='bio' placeholder='Bio' />
                            <Button
                                disabled={isSubmitting || !isValid || !dirty}
                                floated='right'
                                positive
                                content='Update Profile'
                                loading={isSubmitting}
                            />
                        </Form>
                    )
                }
            </Formik>
    )
}