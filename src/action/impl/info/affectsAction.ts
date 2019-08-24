import {inject, injectable} from "inversify"
import {AffectEntity} from "../../../affect/entity/affectEntity"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import SimpleAction from "../simpleAction"

@injectable()
export default class AffectsAction extends SimpleAction {
  private static reduceAffects(affects: AffectEntity[]) {
    return affects.reduce((previous: string, current: AffectEntity) =>
      previous + "\n" + current.affectType + ": " + current.timeout + " hour" + (current.timeout === 1 ? "" : "s"), "")
  }

  constructor(@inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Affects, Messages.Help.NoActionHelpTextProvided)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    return requestService.respondWith()
      .info("Your affects:\n" + AffectsAction.reduceAffects(requestService.getAffects()))
  }
}
