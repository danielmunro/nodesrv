import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {PlayerEntity} from "../../../player/entity/playerEntity"
import PlayerRepository from "../../../player/repository/player"
import PaymentService from "../../../player/service/paymentService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import Maybe from "../../../support/functional/maybe/maybe"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class UnsubscribeAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly playerRepository: PlayerRepository,
    private readonly paymentService: PaymentService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.Unsubscribe
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    return new Maybe<Response>(await this.playerRepository.findOneByMob(mob))
      .do(async (player: PlayerEntity) => {
        if (!player.stripeSubscriptionId) {
          return requestService.respondWith().fail("You don't have a subscription.")
        }
        const response = await this.paymentService.removeSubscription(player)
        await this.playerRepository.save(player)
        return response ?
          requestService.respondWith().success("Subscription canceled") :
          requestService.respondWith().fail("An error occurred")
      })
      .or(() => requestService.respondWith().error("An error occurred"))
      .get()
  }
}
