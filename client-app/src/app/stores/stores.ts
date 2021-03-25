import { createContext, useContext } from 'react';
import ActivityStore from "./activityStore";
import CommonStore from './commonStore';

// Step 1: Create a Store interface that has ActivityStore as a property
interface Store {
    activityStore : ActivityStore;
    commonStore: CommonStore;
}

// Step 2: Create a store that type Store
export const store : Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
}

// Step 3: Create a store context
export const StoreContext = createContext(store);

// Step 4: Create a simple react hook, that allow us to use our store inside our components
export function useStore() {
    return useContext(StoreContext);
}