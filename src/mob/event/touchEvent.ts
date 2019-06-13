import {MobEntity} from "../entity/mobEntity"
import MobEvent from "./mobEvent"

export default interface TouchEvent extends MobEvent {
  readonly target: MobEntity
}
