import { PlayerEntity } from "../../../player/entity/playerEntity"
import CreationService from "../service/creationService"
import AbstractAuthStep from "./abstractAuthStep"

export default abstract class PlayerAuthStep extends AbstractAuthStep {
  constructor(creationService: CreationService, public readonly player: PlayerEntity) {
    super(creationService)
  }
}
