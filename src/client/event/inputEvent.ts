import Action from "../../action/action"
import {EventType} from "../../event/enum/eventType"
import Event from "../../event/event"
import {Mob} from "../../mob/model/mob"
import Request from "../../request/request"
import Response from "../../request/response"

export default class InputEvent implements Event {
  constructor(
    public readonly mob: Mob,
    public readonly request: Request,
    public readonly action: Action,
    public readonly response?: Response) {}

  public getEventType(): EventType {
    return EventType.ClientRequest
  }
}
