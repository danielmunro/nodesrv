import {Mob} from "../model/mob"
import MobEvent from "./mobEvent"

export default interface TouchEvent extends MobEvent {
  readonly target: Mob
}
