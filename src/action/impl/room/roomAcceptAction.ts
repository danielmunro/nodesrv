import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import ClientService from "../../../client/service/clientService"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {RealEstateBidEntity} from "../../../room/entity/realEstateBidEntity"
import {RealEstateBidStatus} from "../../../room/enum/realEstateBidStatus"
import RoomRepository from "../../../room/repository/room"
import RealEstateService from "../../../room/service/realEstateService"
import match from "../../../support/matcher/match"
import {format} from "../../../support/string"
import {Types} from "../../../support/types"
import {ConditionMessages, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class RoomAcceptAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.RealEstateListingService) private readonly realEstateService: RealEstateService,
    @inject(Types.ClientService) private readonly clientService: ClientService,
    @inject(Types.RoomRepository) private readonly roomRepository: RoomRepository) {
    super()
  }

  public getRequestType(): RequestType {
    return RequestType.RoomBidAccept
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
      .requireFromActionParts(this.getActionParts())
      .not().requireFight(ConditionMessages.All.Mob.Fighting)
      .require(room.owner.is(request.mob), Messages.Room.Accept.RoomNotOwned)
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
          room.owner = bid.bidder
          await this.roomRepository.save(room)
          this.clientService.sendMessageToMob(
            mob,
            format(Messages.Room.Accept.Accepted, { room: room.name }))
        } else {
          bid.status = RealEstateBidStatus.Rejected
          bid.bidder.gold += bid.amount
          this.clientService.sendMessageToMob(
            bid.bidder,
            format(Messages.Room.Accept.Rejected, { room: bid.listing.room.name, gold: bid.amount}))
        }
        await this.realEstateService.saveBid(bid)
      }))

    return requestService.respondWith().success(
      Messages.Room.Accept.Success, { room: room.name, mob: winningBid.bidder, gold: winningBid.amount })
  }
}
