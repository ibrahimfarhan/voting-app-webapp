import { handleRemovedMember, startLoading, receivePublicNonJoinedTeams, handleJoiningPublicTeam, changeSelectedTeamsType, receiveTeam } from './../actions/team';
import { createReducer } from '@reduxjs/toolkit';
import { TeamsState } from '../../models/state-types';
import { receiveTeams, removeTeamFromTable } from '../actions/team';

const initialTeamsState: TeamsState = {
  loading: true,
};

const teams = createReducer(initialTeamsState, (builder) => {

  builder.addCase(receiveTeam, (state, action) => {
    const team = action.payload;
    team.currentUserIsJoined = true;
    if (!state.data) state.data = {};
    state.data[team.id] = Object.assign(state.data[team.id] || {}, team);
    state.loading = false;
  });

  builder.addCase(receiveTeams, (state, action) => {
    state.data = action.payload.reduce((agg, t) => Object.assign(agg, {
      [t.id]: Object.assign(t, {
        currentUserIsJoined: true
      })
    }), {});
    state.loading = false;
    state.loadingSelectedTeams = false;
    state.selectedTeamsType = 'joined';
  });

  builder.addCase(receivePublicNonJoinedTeams, (state, action) => {
    state.data = action.payload.reduce((agg, t) => Object.assign(agg, {
      [t.id]: Object.assign(t, {
        currentUserIsJoined: false
      })
    }), {});
    state.loading = false;
    state.loadingSelectedTeams = false;
    state.selectedTeamsType = 'nonJoined';
  });

  builder.addCase(removeTeamFromTable, (state, action) => {
    if (state.data) delete state.data[action.payload];
  });

  builder.addCase(handleRemovedMember, (state, action) => {
    const { teamId, userId, wasAdmin } = action.payload;
    if (!state.data) return;
    const { admins = [], members = [] } = state.data[teamId];
    const targetArray = wasAdmin ? admins : members;
    const targetUserIndex = targetArray.findIndex(a => a.id === userId);
    targetArray.splice(targetUserIndex, 1);
  });

  builder.addCase(handleJoiningPublicTeam, (state, action) => {
    if(state.data) {
      const team = state.data[action.payload];
      team.currentUserIsJoined = true;
    }
    state.loading = false;
  });

  builder.addCase(startLoading, (state, action) => {
    state.loading = true;
  });

  builder.addCase(changeSelectedTeamsType, (state, action) => {
    state.loadingSelectedTeams = true;
    state.selectedTeamsType = state.selectedTeamsType === 'joined' ? 'nonJoined' : 'joined';
  });

  builder.addDefaultCase((state) => { state = initialTeamsState });
});

export default teams;