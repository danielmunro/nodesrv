import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {MobEntity} from "../../../mob/entity/mobEntity"
import MobService from "../../../mob/service/mobService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {RealEstateBidEntity} from "../../../room/entity/realEstateBidEntity"
import {RealEstateBidStatus} from "../../../room/enum/realEstateBidStatus"
import RealEstateService from "../../../room/service/realEstateService"
import ClientService from "../../../server/service/clientService"
import match from "../../../support/matcher/match"
import {format} from "../../../support/string"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class RoomAcceptAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly realEstateService: RealEstateService,
    private readonly mobService: MobService,
    private readonly clientService: ClientService) {
    super()
  }

  public getRequestType(): RequestType {
    return RequestType.RoomAccept
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Directive, ActionPart.Mob ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public check(request: Request): Promise<Check> {
    const room = request.getRoom()
    const bids = this.realEstateService.getBidsForRoom(room)
    const matchingBid = bids.find(bid => match(bid.bidder.name, request.getComponent()))
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
      .not().requireFight(ConditionMessages.All.Mob.Fighting)
      .require(matchingBid, Messages.Room.Accept.BidNotFound, CheckType.Bid)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const winningBid = requestService.getResult<RealEstateBidEntity>(CheckType.Bid)
    const room = requestService.getRoom()
    await Promise.all(this.realEstateService.getBidsForRoom(room)
      .map(async bid => {
        if (bid === winningBid) {
          bid.status = RealEstateBidStatus.Approved
          const mob = requestService.getMob()
          mob.gold += bid.amount
          this.clientService.sendMessageToMob(
            mob,
            format(Messages.Room.Accept.Accepted, { room: room.name }))
        } else {
          bid.status = RealEstateBidStatus.Rejected
          const mobLost = this.mobService.findMob(m => m.is(bid.bidder)) as MobEntity
          mobLost.gold += bid.amount
          this.clientService.sendMessageToMob(
            mobLost,
            format(Messages.Room.Accept.Rejected, { room: bid.listing.room.name, gold: bid.amount}))
        }
        await this.realEstateService.saveBid(bid)
      }))

    return requestService.respondWith().success(
      Messages.Room.Accept.Success, { room: room.name })
  }
}
