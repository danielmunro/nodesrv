import Event from "../../event/event"
import {MobEntity} from "../entity/mobEntity"

export default interface MobEvent extends Event {
  readonly mob: MobEntity
}
