import Event from "../../../event/interface/event"
import {MobEntity} from "../../entity/mobEntity"
import {Attack} from "../attack"
import {Fight} from "../fight"

export default interface FightEvent extends Event {
  readonly mob: MobEntity
  readonly fight: Fight
  readonly attacks: Attack[]
}
