import {MobEntity} from "../entity/mobEntity"
import MobEvent from "./mobEvent"

export default interface AttackEvent extends MobEvent {
  readonly target: MobEntity
}
