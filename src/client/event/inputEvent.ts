import Action from "../../action/action"
import {EventType} from "../../event/enum/eventType"
import Event from "../../event/event"
import {Mob} from "../../mob/model/mob"
import Request from "../../request/request"
import Response from "../../request/response"

export default interface InputEvent extends Event {
  readonly mob: Mob
  readonly request: Request
  readonly action: Action
  readonly response?: Response
  readonly eventType: EventType.ClientRequest
}
