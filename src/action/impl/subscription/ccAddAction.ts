import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
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

export default class CcAddAction extends Action {
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
    return RequestType.CCAdd
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    return new Maybe<Response>(await this.playerRepository.findOneByMob(mob))
      .do(async player => {
        const words = requestService.getRequest().getContextAsInput().words
        const nickname = words[1]
        const ccNumber = words[2]
        const expMonth = parseInt(words[3], 10)
        const expYear = parseInt(words[4], 10)
        await this.paymentService.addPaymentMethod(
          player,
          nickname,
          ccNumber,
          expMonth,
          expYear)
        await this.playerRepository.save(player)
        return requestService.respondWith().success("payment method added")
      })
      .or(() => requestService.respondWith().error("An error occurred"))
      .get()
  }
}
