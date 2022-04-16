import { combineReducers } from "redux";
import toolbarItem from "../features/toolbar-item/toolbarItemsSlice";

export const RootReducer = combineReducers({
    toolbarItem,
});

// ??? not relevant for now - read more about redux epics and observables
// export type RootStoreType = ReturnType<typeof RootReducer>
