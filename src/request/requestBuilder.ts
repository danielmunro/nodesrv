import Action from "../action/action"
import {ActionPart} from "../action/enum/actionPart"
import LocationService from "../mob/locationService"
import {Mob} from "../mob/model/mob"
import {Room} from "../room/model/room"
import match from "../support/matcher/match"
import InputContext from "./context/inputContext"
import {Request} from "./request"
import {RequestType} from "./requestType"

export default class RequestBuilder {
  constructor(
    private readonly actions: Action[],
    private readonly locationService: LocationService,
    private readonly mob: Mob,
    private readonly room?: Room) {}

  public create(requestType: RequestType, input: string = requestType.toString()): Request {
    if (!input) {
      input = requestType.toString()
    }

    return new Request(
      this.mob,
      this.room as Room,
      new InputContext(requestType, input),
      this.getTargetFromRequest(requestType, input))
  }

  private getTargetFromRequest(requestType: RequestType, input: string): Mob | undefined {
    const action = this.actions.find((a: Action) => a.isAbleToHandleRequestType(requestType))
    if (!action) {
      return
    }
    const words = input.split(" ")
    const actionParts = action.getActionParts()
    const word = words.find(() => {
      const latest = actionParts.pop()
      return latest === ActionPart.Target
    }) as string
    return this.locationService
      .getMobsByRoom(this.room as Room)
      .find((mob: Mob) => match(mob.name, word))
  }
}
