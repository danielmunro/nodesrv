import { Player } from "../../player/model/player"

export default abstract class PlayerAuthStep {
  public readonly player: Player

  constructor(player: Player) {
    this.player = player
  }
}
