import { Project } from './../domain/project.model';
import { TaskList } from './../domain/task-list.model';
import * as prjActions from '../actions/project.action';
import * as actions from '../actions/task-list.action';
import * as  _ from 'lodash';
import { createSelector } from '@ngrx/store';

export interface State {
    ids: string[];
    entities: { [id: string]: TaskList };
    selectedIds: string[];
}

export const initialState: State = {
    ids: [],
    entities: {},
    selectedIds: null,
};

const addTaskList = (state, action) => {
    const taskLists = action.payload;
    if (state.entities[taskLists.id]) {
        return state;
    }
    const newIds = [...state.ids, taskLists.id];
    const newEntities = { ...state.entities, [taskLists.id]: taskLists };
    return { ...state, ids: newIds, entities: newEntities };
};

const updateTaskList = (state, action) => {
    const taskList = action.payload;

    const newEntities = { ...state.entities, [taskList.id]: taskList };
    return { ...state, entities: newEntities };
};

const delTaskList = (state, action) => {
    const taskList = <Project>action.payload;
    const newIds = state.ids.filter(id => id !== taskList.id);
    const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: state.entities[id] }), {});
    const newSelectedIds = state.selectedIds.filter(id => id !== taskList.id);

    return {
        ids: newIds,
        entities: newEntities,
        selectedIds: newSelectedIds,
    };
}

const loadTaskLists = (state, action) => {
    const taskLists = action.payload;
    if (taskLists === null) {
        return state;
    }
    // const incomingIds = taskLists.map(p => p.id);
    // // 比较，不一样的会保留下来形成新的数组
    // const newIds = _.difference(incomingIds, state.id);
    const newTaskLists = taskLists.filter(taskList => !state.entities[taskList.id]);
  if (newTaskLists.length === 0) {
    return state;
  }
  const newIds = newTaskLists.map(taskList => taskList.id);
    const incomingEntities = _.chain(taskLists)
        .keyBy('id')
        .mapValues(o => o)
        .value();
    const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: incomingEntities[id] }), {});
    return {
        ...state,
        ids: [...state.ids, ...newIds],
        entities: { ...state.entities, ...newEntities },
        selectedIds: [],
    };
}

const swapTaskLists = (state, action) => {
    const taskLists = <TaskList[]>action.payload;
    const updateEntities = _.chain(taskLists)
        .keyBy('id')
        .mapValues(o => o)
        .value();
    const newEntities = { ...state.entities, ...updateEntities };
    return {
        ...state,
        entities: newEntities
    };
}

const selectPrj = (state, action) => {
    const selected = <Project>action.payload;
    const selectedIds = state.ids.filter(id => state.entities[id].projectId === selected.id);
    return {
        ...state,
        selectedIds: selectedIds
    };
}

const delListByPrj = (state: State, action: prjActions.DeleteSuccessAction) => {
    const project = action.payload;
    // 如果不同则留下 。。
    const taskListIds = project.taskLists;
    const remainingIds = _.difference(state.ids, taskListIds);
    const remainingEntities = remainingIds.reduce((entities, id) => ({ ...entities, [id]: state.entities[id] }), {});
    return {
        ids: [...remainingIds],
        entities: remainingEntities,
        selectedIds: []
    };
}

export function reducer(state = initialState, action: actions.Actions): State {
    switch (action.type) {
        case actions.ActionTypes.ADD_SUCCESS: {
            return addTaskList(state, action);
        }

        case actions.ActionTypes.DELETE_SUCCESS: {
            return delTaskList(state, action);
        }

        case actions.ActionTypes.UPDATE_SUCCESS: {
            return updateTaskList(state, action);
        }

        case actions.ActionTypes.LOAD_SUCCESS: {
            return loadTaskLists(state, action);
        }
        case actions.ActionTypes.SWAP_SUCCESS: {
            return swapTaskLists(state, action);
        }
        case prjActions.ActionTypes.SELECT_PROJECT: {
            return selectPrj(state, action);
        }

        case prjActions.ActionTypes.DELETE_SUCCESS: {
            return { ...delListByPrj(state, action) };

        }
        default: {
            return state;
        }
    }
}

export const getIds = (state: State) => state.ids;

export const getEntities = (state: State) => state.entities;

export const getSelectedIds = (state: State) => state.selectedIds;

export const getSelected = createSelector(getIds, getEntities, (ids, entities) => {
    return ids.map(id => entities[id]);
});