import { GlobalMessage } from "./global-message";
import Team from "./team";
import { User } from "./user";

export interface RootState {
  user: UserState
  teams: TeamsState
  global: { message: GlobalMessage }
}

export default interface EntityState<T> {
  data?: T
  loading: boolean
  error?: string
}

export interface UserState extends EntityState<User> {
  isLoggedIn?: boolean
}

export interface TeamsState extends EntityState<{[key: string]: Team}> {
  newTeamCreated?: boolean
  selectedTeamsType?: 'joined' | 'nonJoined'
  loadingSelectedTeams?: boolean
}