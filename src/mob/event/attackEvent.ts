import {Mob} from "../model/mob"
import MobEvent from "./mobEvent"

export default interface AttackEvent extends MobEvent {
  readonly target: Mob
}
