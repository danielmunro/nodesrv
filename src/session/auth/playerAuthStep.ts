import { Player } from "../../player/model/player"

export default abstract class PlayerAuthStep {
  constructor(public readonly player: Player) {}
}
