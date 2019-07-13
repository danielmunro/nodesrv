import Event from "../../event/interface/event"
import {MobEntity} from "../entity/mobEntity"

export default interface MobEvent extends Event {
  readonly mob: MobEntity
}
