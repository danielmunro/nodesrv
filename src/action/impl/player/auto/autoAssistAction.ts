import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Response from "../../../../messageExchange/response"
import RequestService from "../../../../messageExchange/service/requestService"
import {Types} from "../../../../support/types"
import {Messages} from "../../../constants"
import SimpleAction from "../../simpleAction"

@injectable()
export default class AutoAssistAction extends SimpleAction {
  constructor(@inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.AutoAssist, Messages.Help.NoActionHelpTextProvided)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    mob.playerMob.autoAssist = !mob.playerMob.autoAssist
    return requestService.respondWith().success(`Auto-assist toggled ${mob.playerMob.autoAssist ? "on" : "off"}.`)
  }
}
