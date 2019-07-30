import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {RealEstateListingEntity} from "../../../room/entity/realEstateListingEntity"
import RealEstateService from "../../../room/service/realEstateService"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class RoomSellAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly realEstateService: RealEstateService) {
    super()
  }

  public getRequestType(): RequestType {
    return RequestType.RoomSell
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Directive, ActionPart.Amount ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public check(request: Request): Promise<Check> {
    const room = request.getRoom()
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
      .not().requireFight(ConditionMessages.All.Mob.Fighting)
      .require(room.isOwnable && room.owner, Messages.Room.Sell.RoomIsNotOwned)
      .require(() => room.owner.is(request.mob), Messages.Room.Sell.RoomIsNotOwnedByYou)
      .require(parseInt(request.getComponent(), 10), Messages.Room.Sell.AmountIsRequired, CheckType.Amount)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const room = requestService.getRoom()
    const amount = parseInt(requestService.getComponent(), 10)
    const realEstateListing = new RealEstateListingEntity()
    realEstateListing.agent = mob
    realEstateListing.room = room
    realEstateListing.offeringPrice = amount
    await this.realEstateService.createListing(realEstateListing)
    return requestService.respondWith().success(Messages.Room.Sell.Success, { room: room.name, amount })
  }
}
