import { Player } from "../../player/model/player"
import AbstractAuthStep from "./abstractAuthStep"
import AuthService from "./authService"

export default abstract class PlayerAuthStep extends AbstractAuthStep {
  constructor(authService: AuthService, public readonly player: Player) {
    super(authService)
  }
}
