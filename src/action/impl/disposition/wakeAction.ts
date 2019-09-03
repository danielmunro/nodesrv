import {inject, injectable} from "inversify"
import {AffectType} from "../../../affect/enum/affectType"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Disposition} from "../../../mob/enum/disposition"
import {Types} from "../../../support/types"
import {HelpMessages, Messages} from "../../constants"
import {MESSAGE_FAIL_ALREADY_AWAKE} from "../../constants"
import SimpleAction from "../simpleAction"

@injectable()
export default class WakeAction extends SimpleAction {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Wake, HelpMessages.ChangeDisposition)
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .not().requireDisposition(Disposition.Standing, MESSAGE_FAIL_ALREADY_AWAKE)
      .not().requireAffect(AffectType.Sleep, Messages.Wake.CannotWakeUp)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService
      .setMobDisposition(Disposition.Standing)
      .respondWith()
      .okWithMessage(requestService.createResponseMessage(Messages.Wake.Success)
        .setVerbToRequestCreator("wake")
        .addReplacementForRequestCreator("verb2", "stand")
        .setVerbToTarget("wake")
        .addReplacementForTarget("verb2", "stand")
        .setVerbToObservers("wakes")
        .addReplacementForObservers("verb2", "stands"))
  }
}
