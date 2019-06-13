import { PlayerEntity } from "../../player/entity/playerEntity"
import AbstractAuthStep from "./abstractAuthStep"
import CreationService from "./creationService"

export default abstract class PlayerAuthStep extends AbstractAuthStep {
  constructor(creationService: CreationService, public readonly player: PlayerEntity) {
    super(creationService)
  }
}
