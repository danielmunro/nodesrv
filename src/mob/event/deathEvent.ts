import Event from "../../event/interface/event"
import Death from "../fight/death"
import {Fight} from "../fight/fight"
import {Round} from "../fight/round"

export default interface DeathEvent extends Event {
  readonly death: Death
  readonly round?: Round
  readonly fight?: Fight
}
