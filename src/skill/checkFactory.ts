import { Player } from "../player/model/player"
import Check from "./check"
import { CheckResult } from "./checkResult"

export function successCheck(cost: (player: Player) => void): Promise<Check> {
  return Promise.resolve(new Check(CheckResult.Able, null, cost))
}

export function failCheck(message: string): Promise<Check> {
  return Promise.resolve(new Check(CheckResult.Unable, message))
}
