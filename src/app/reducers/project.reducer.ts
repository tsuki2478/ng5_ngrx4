import { Observable } from 'rxjs/Observable';
import * as actions from '../actions/project.action';
import { Project } from '../domain';

import * as  _ from 'lodash';
import { createSelector } from '@ngrx/store';

export interface State {
    ids: string[];
    entities: { [id: string]: Project };
    selectedId: string | null;
}

export const initialState: State = {
    ids: [],
    entities: {},
    selectedId: null,
};

const addProject = (state, action) => {
    const project = action.payload;
    if (state.entities[project.id]) {
        return state;
    }
    const newIds = [...state.ids, project.id];
    const newEntities = { ...state.entities, [project.id]: project };
    return { ...state, ids: newIds, entities: newEntities };
};

const updateProject = (state, action) => {
    const project = action.payload;

    const newEntities = { ...state.entities, [project.id]: project };
    return { ...state, entities: newEntities };
};

const delProject = (state, action) => {
    const project = action.payload;
    const newIds = state.ids.filter(id => id !== project.id);
    const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: state.entities[id] }), {});
    return {
        ids: newIds,
        entities: newEntities,
        selectedId: null,
    };
}



const loadProject = (state, action) => {
    const projects = action.payload;
    if (projects === null) {
        return state;
    }
    // const incomingIds = projects.map(p => p.id);
    // 比较，不一样的会保留下来形成新的数组
    // const newIds = _.difference(incomingIds, state.id);

    const newProjects = projects.filter(project => !state.entities[project.id]);
    console.group('1');
    console.log(newProjects);
    console.log(state.entities);
    console.groupEnd();
    const newIds = newProjects.map(project => project.id);
    if (newProjects.length === 0) {
      return state;
    }

    const incomingEntities = _.chain(projects)
        .keyBy('id')
        .mapValues(o => o)
        .value();
    const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: incomingEntities[id] }), {});

    // console.group('loadProject');
    // console.log(newIds);
    // console.log(incomingEntities);
    // console.log(newEntities);
    // console.groupEnd();
    return {
        ids: [...state.ids, ...newIds],
        entities: { ...state.entities, ...newEntities },
        selectedId: null
    };
};

export function reducer(state = initialState, action: actions.Actions): State {
    switch (action.type) {
        case actions.ActionTypes.ADD_SUCCESS: {
            return addProject(state, action);
        }

        case actions.ActionTypes.INVITE_SUCCESS:
        case actions.ActionTypes.DELETE_SUCCESS: {
            return delProject(state, action);
        }

        case actions.ActionTypes.UPDATE_SUCCESS: {
            return updateProject(state, action);
        }

        case actions.ActionTypes.LOAD_SUCCESS: {
            return loadProject(state, action);
        }

        case actions.ActionTypes.SELECT_PROJECT:
            return { ...state, selectedId: action.payload.id };

        default: {
            return state;
        }
    }
}

export const getIds = (state: State) => state.ids;

export const getEntities = (state: State) => state.entities;

export const getSelectedId = (state: State) => state.selectedId;

export const getAll = createSelector(getIds, getEntities, (ids, entities) => {
    // console.log(ids);
    // console.log(entities);
    // const aa = ids.map(id => entities[id])
        // .filter(o => o.id === o.id);
    return ids.map(id => entities[id]);
})
