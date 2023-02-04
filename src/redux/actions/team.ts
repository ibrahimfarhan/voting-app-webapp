import { createAction } from "@reduxjs/toolkit";
import teamApi from "../../api/team";
import userApi from "../../api/user";
import Team from "../../models/team";
import { createThunk } from "../helpers/api";

export const receiveTeam = createAction<Team>('receiveTeam');
export const receiveTeams = createAction<Team[]>('receiveTeams');
export const receivePublicNonJoinedTeams = createAction<Team[]>('receivePublicNonJoinedTeams');
export const removeTeamFromTable = createAction<string>('removeTeamFromTable');
export const handleRemovedMember = createAction<{ userId: string, teamId: string, wasAdmin: boolean }>('handleRemovedMember');
export const handleJoiningTeam = createAction<Team>('handleJoiningTeam');
export const handleJoiningPublicTeam = createAction<string>('handleJoiningPublicTeam');
export const startLoading = createAction('startLoading');
export const changeSelectedTeamsType = createAction<'joined' | 'nonJoined', string>('changeSelectedTeamsType');

export const getTeam = (id: string) => createThunk({
  path: teamApi.getUrl(id),
  successActionCreator: receiveTeam
});

export const getMyTeams = () => createThunk({
  path: userApi.teams,
  successActionCreator: receiveTeams
});

export const getPublicNonJoinedTeams = () => createThunk({
  path: teamApi.getPublic,
  successActionCreator: receivePublicNonJoinedTeams
});

export const removeMember = (data: {
  userId: string,
  teamId: string,
  wasAdmin: boolean
}) => createThunk({
  path: teamApi.removeMember,
  successActionCreator: handleRemovedMember,
  successActionPayload: data,
  additionalReqOptions: {
    method: 'PATCH',
    body: JSON.stringify(data)
  }
});

export const updateTeam = (data: Team) => createThunk({
  path: teamApi.getUrl(data.id),
  successActionCreator: receiveTeam,
  additionalReqOptions: {
    method: 'PATCH',
    body: JSON.stringify(data)
  }
});

export const leaveTeam = (teamId: string) => createThunk({
  path: teamApi.leave,
  successActionCreator: removeTeamFromTable,
  successActionPayload: teamId,
  additionalReqOptions: {
    method: 'PATCH',
    body: JSON.stringify({ id: teamId })
  }
});

export const createTeam = (data: { name: string, isPublic: boolean }) => createThunk({
  path: teamApi.create,
  successActionCreator: receiveTeam,
  additionalReqOptions: {
    method: 'POST',
    body: JSON.stringify(data)
  }
});

export const joinTeam = (token: string) => createThunk({
  path: teamApi.getJoinTeamUrl(token),
  successActionCreator: handleJoiningTeam,
  additionalReqOptions: {
    method: 'PATCH',
  }
});

export const joinPublicTeam = (teamId: string) => createThunk({
  path: teamApi.getJoinTeamUrl(teamId),
  successActionCreator: handleJoiningPublicTeam,
  successActionPayload: teamId,
  additionalReqOptions: {
    method: 'PATCH'
  }
});

export const deleteTeam = (id: string) => createThunk({
  path: teamApi.getUrl(id),
  successActionCreator: removeTeamFromTable,
  successActionPayload: id,
  additionalReqOptions: {
    method: 'DELETE'
  }
});