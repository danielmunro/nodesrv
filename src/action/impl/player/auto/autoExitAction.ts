import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Response from "../../../../messageExchange/response"
import RequestService from "../../../../messageExchange/service/requestService"
import {Types} from "../../../../support/types"
import {Messages} from "../../../constants"
import SimpleAction from "../../simpleAction"

@injectable()
export default class AutoExitAction extends SimpleAction {
  constructor(@inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.AutoExit, Messages.Help.NoActionHelpTextProvided)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    mob.playerMob.autoExit = !mob.playerMob.autoExit
    return requestService.respondWith().success(`Auto-exit toggled ${mob.playerMob.autoExit ? "on" : "off"}.`)
  }
}
