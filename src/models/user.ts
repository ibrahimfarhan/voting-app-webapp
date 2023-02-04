import Team from "./team";

export interface LoginData {
  username?: string,
  email?: string,
  password: string
}

export interface RegisterData {
  username: string,
  email: string,
  password: string
}

export interface User {
  id: string,
  username: string,
  name?: string,
  email: string,
  pictureUrl?: string
}