import { Player } from "../../player/model/player"
import AbstractAuthStep from "./abstractAuthStep"
import CreationService from "./creationService"

export default abstract class PlayerAuthStep extends AbstractAuthStep {
  constructor(creationService: CreationService, public readonly player: Player) {
    super(creationService)
  }
}
