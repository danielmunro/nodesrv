import Action from "../action/action"
import {ActionPart} from "../action/enum/actionPart"
import {Mob} from "../mob/model/mob"
import LocationService from "../mob/service/locationService"
import {Room} from "../room/model/room"
import Maybe from "../support/functional/maybe"
import match from "../support/matcher/match"
import InputContext from "./context/inputContext"
import Request from "./request"
import {RequestType} from "./requestType"

export default class RequestBuilder {
  constructor(
    private readonly actions: Action[],
    private readonly locationService: LocationService,
    private readonly mob: Mob,
    private readonly room?: Room) {}

  public create(requestType: RequestType, input: string = requestType.toString()): Request {
    return new Request(
      this.mob,
      this.room as Room,
      new InputContext(requestType, input),
      this.getTargetFromRequest(requestType, input))
  }

  private getTargetFromRequest(requestType: RequestType, input: string): Mob | undefined {
    const actionParts = new Maybe(this.actions.find((a: Action) => a.isAbleToHandleRequestType(requestType)))
      .do(action => action.getActionParts())
      .or(() => [])
      .get() as ActionPart[]
    if (!actionParts.some(actionPart => actionPart === ActionPart.Hostile)) {
      return
    }
    const words = input.split(" ")
    const word = words.find(() => {
      const latest = actionParts.shift()
      return latest === ActionPart.Hostile
    })
    if (!word) {
      return
    }
    return this.locationService
      .getMobsByRoom(this.room as Room)
      .find((mob: Mob) => match(mob.name, word))
  }
}
