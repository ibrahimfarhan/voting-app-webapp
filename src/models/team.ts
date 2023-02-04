import { User } from "./user";

export default interface Team {
  id: string,
  name: string,
  admins?: User[],
  members?: User[],
  isPublic?: boolean,
  currentUserIsJoined?: boolean
}