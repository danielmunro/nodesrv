import Event from "../../event/interface/event"
import {Client} from "../client"

export default interface ClientEvent extends Event {
  readonly client: Client
}
