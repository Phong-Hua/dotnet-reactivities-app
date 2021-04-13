import {Menu, Header} from 'semantic-ui-react';
import Calendar from 'react-calendar';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/stores';

export default observer(function ActivityFilters () {
    const {activityStore: {predicate, setPredicate}} = useStore();
    return (
    <>
        <Menu vertical size='large' style={{width: '100%', marginTop: 25}}>
            <Header icon='filter' attached color='teal' content='Filters'/>
            <Menu.Item 
                content='All Activities' 
                active={predicate.has('all')}   // make it active if the predicate is set to all
                onClick={() => setPredicate('all', 'true')}    
            />
            <Menu.Item 
                content="I'm going" 
                active={predicate.has('isGoing')}   // make it active if the predicate is set to all
                onClick={() => setPredicate('isGoing', 'true')}     
            />
            <Menu.Item 
                content="I'm hosting" 
                active={predicate.has('isHost')}   // make it active if the predicate is set to all
                onClick={() => setPredicate('isHost', 'true')}    
                />
        </Menu>
        <Header />
        <Calendar 
            onChange={(date) => setPredicate('startDate', date as Date)}
            value={predicate.get('startDate') || new Date()}
        />
    </>
    )
})