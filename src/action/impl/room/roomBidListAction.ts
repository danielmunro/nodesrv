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

export default class RoomBidListAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly realEstateService: RealEstateService) {
    super()
  }

  public getRequestType(): RequestType {
    return RequestType.RoomBidList
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Directive ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public check(request: Request): Promise<Check> {
    const room = request.getRoom()
    const bids = this.realEstateService.getBidsForRoom(room)
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
      .not().requireFight(ConditionMessages.All.Mob.Fighting)
      .require(room.isOwnable, Messages.Room.Bid.CannotBid)
      .require(() => room.owner.is(request.mob), Messages.Room.Bid.AlreadyOwn)
      .require(this.realEstateService.getListing(room), Messages.Room.Bid.NotBeingSold, CheckType.ValidSubject)
      .require(bids, Messages.Room.BidList.NoBids, CheckType.Bid)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const room = requestService.getRoom()
    const bids = requestService.getResult<RealEstateBidEntity[]>(CheckType.Bid)

    return requestService.respondWith().success(Messages.Room.BidList.Success, {
      bids: bids.reduce((previous: string, current: RealEstateBidEntity) =>
        previous + "\n" + current.bidder.name + ": " + current.amount + " gold", ""),
      room: room.name,
    })
  }
}
