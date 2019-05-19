import Event from "../../event/event"
import {Client} from "../client"

export default interface ClientEvent extends Event {
  readonly client: Client
}
