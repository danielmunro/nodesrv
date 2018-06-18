import { Player } from "../player/model/player"
import Attempt from "./attempt"
import { CheckResult } from "./checkResult"

export default class Check {
  public readonly attempt: Attempt
  public readonly checkResult: CheckResult
  public readonly message: string
  public readonly cost: (player: Player) => void

  constructor(
    attempt: Attempt, checkResult: CheckResult, message: string = null, cost: (player: Player) => void = null) {
    this.attempt = attempt
    this.checkResult = checkResult
    this.message = message
    this.cost = cost
  }
}
