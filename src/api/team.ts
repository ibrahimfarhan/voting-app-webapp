import apiUrl from "./urls";

const teamApiUrl = `${apiUrl || ''}/api/v1/team`;

const teamApi = {
  getPublic: `${teamApiUrl}/all-public`,
  getUrl: (id: string) => `${teamApiUrl}/${id}`,
  create: `${teamApiUrl}/create`,
  getInvitationLinkUrl: (id: string) => `${teamApiUrl}/${id}/invite`,
  getJoinTeamUrl: (token: string) => `${teamApiUrl}/join/${token}`,
  leave: `${teamApiUrl}/leave`,
  toggleRole: `${teamApiUrl}/toggle-role`,
  removeMember: `${teamApiUrl}/remove-member`
}

export default teamApi;