import { Player } from "../player/model/player"
import Attempt from "./attempt"
import Check from "./check"
import { CheckResult } from "./checkResult"

export function successCheck(attempt: Attempt, cost: (player: Player) => void): Promise<Check> {
  return new Promise((resolve) => resolve(new Check(attempt, CheckResult.Able, null, cost)))
}

export function failCheck(attempt: Attempt, message: string): Promise<Check> {
  return new Promise((resolve) => resolve(new Check(attempt, CheckResult.Unable, message)))
}
