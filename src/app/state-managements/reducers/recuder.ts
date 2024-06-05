import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import * as fvInfoReducer from './fv-info.reducer';
import * as fvOverviewReducer from './fv-overview.reducer';

export const reducers: ActionReducerMap<any> = {
    fvState : fvInfoReducer.reducer,
    fvOverview : fvOverviewReducer.reducer
};

