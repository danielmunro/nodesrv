import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {ExitEntity} from "../../../room/entity/exitEntity"
import {Direction} from "../../../room/enum/direction"
import RoomService from "../../../room/service/roomService"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class RoomJoinAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.RoomService) private readonly roomService: RoomService) {
    super()
  }

  public getRequestType(): RequestType {
    return RequestType.RoomJoin
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Directive, ActionPart.Direction ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const direction = requestService.getResult<Direction>(CheckType.Direction)
    const sourceRoom = requestService.getRoom()
    const destinationExit = sourceRoom.exits.find(exit => exit.direction === direction) as ExitEntity
    const destinationRoom = destinationExit.destination
    const groupName = destinationExit.source.groupName
    destinationRoom.groupName = groupName
    await this.roomService.saveRoom(destinationRoom)
    return requestService.respondWith()
      .info(`${destinationRoom.name} group is updated to '${groupName}'`)
  }
}
