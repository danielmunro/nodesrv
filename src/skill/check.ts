import { Player } from "../player/model/player"
import { CheckResult } from "./checkResult"

export default class Check {
  constructor(
    public readonly checkResult: CheckResult,
    public readonly message: string = null,
    public readonly cost: (player: Player) => void = null) {}
}
