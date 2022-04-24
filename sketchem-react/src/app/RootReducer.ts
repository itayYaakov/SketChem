import toolbarItem from "@features/toolbar-item/toolbarItemsSlice";
import { RootState } from "@types";
import { combineReducers, Reducer } from "redux";

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
    toolbarItem,
});

// ??? not relevant for now - read more about redux epics and observables
// export type RootStoreType = ReturnType<typeof RootReducer>
export default rootReducer;
