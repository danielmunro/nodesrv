import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {RealEstateBidEntity} from "../../../room/entity/realEstateBidEntity"
import RealEstateService from "../../../room/service/realEstateService"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class RoomBidAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly realEstateService: RealEstateService) {
    super()
  }

  public getRequestType(): RequestType {
    return RequestType.RoomBid
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
      .require(room.isOwnable, Messages.Room.Bid.CannotBid)
      .not().require(() => room.owner.is(request.mob), Messages.Room.Bid.AlreadyOwn)
      .require(parseInt(request.getComponent(), 10), Messages.Room.Bid.AmountIsRequired, CheckType.Amount)
      .capture()
      .require((amount: number) => request.mob.gold >= amount, Messages.Room.Bid.NotEnoughGold)
      .require(this.realEstateService.getListing(room), Messages.Room.Bid.NotBeingSold, CheckType.ValidSubject)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const room = requestService.getRoom()
    const amount = requestService.getResult(CheckType.Amount)
    const listing = requestService.getResult(CheckType.ValidSubject)
    const realEstateBid = new RealEstateBidEntity()
    realEstateBid.bidder = mob
    realEstateBid.listing = listing
    realEstateBid.amount = amount
    await this.realEstateService.createBid(realEstateBid)
    return requestService.respondWith().success(Messages.Room.Bid.Success, { room: room.name, amount })
  }
}
