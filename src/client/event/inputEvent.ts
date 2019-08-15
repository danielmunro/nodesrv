import Action from "../../action/impl/action"
import {EventType} from "../../event/enum/eventType"
import Event from "../../event/interface/event"
import Request from "../../messageExchange/request"
import Response from "../../messageExchange/response"
import {MobEntity} from "../../mob/entity/mobEntity"

export default interface InputEvent extends Event {
  readonly mob: MobEntity
  readonly request: Request
  readonly action: Action
  readonly response?: Response
  readonly eventType: EventType.ClientRequest
}
