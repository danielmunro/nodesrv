import AuthService from "./authService"

export default class AbstractAuthStep {
  constructor(protected readonly authService: AuthService) {}
}
