import {Mob} from "../model/mob"
import MobEvent from "./mobEvent"

export default interface AttackEvent extends MobEvent {
  readonly mob: Mob
  readonly target: Mob
}
