import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {PaymentMethodEntity} from "../../../player/entity/paymentMethodEntity"
import PlayerRepository from "../../../player/repository/player"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import Maybe from "../../../support/functional/maybe/maybe"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class CcListAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly playerRepository: PlayerRepository) {
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
    return RequestType.CCList
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    return new Maybe<Response>(await this.playerRepository.findOneByMob(mob))
      .do(player =>
        requestService.respondWith().info(player.paymentMethods ?
           player.paymentMethods.reduce(
            (previous: string, current: PaymentMethodEntity) =>
              previous + "\n" + current.nickname + " - created " +
              current.created.format("YYYY-MM-DD"), "Your payment methods: ") :
          "You have no payment methods defined"))
      .or(() => requestService.respondWith().error("An error occurred"))
      .get()
  }

}
