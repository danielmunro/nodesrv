import Action from "../../action/impl/action"
import {EventType} from "../../event/enum/eventType"
import Event from "../../event/interface/event"
import {MobEntity} from "../../mob/entity/mobEntity"
import Request from "../../request/request"
import Response from "../../request/response"

export default interface InputEvent extends Event {
  readonly mob: MobEntity
  readonly request: Request
  readonly action: Action
  readonly response?: Response
  readonly eventType: EventType.ClientRequest
}
