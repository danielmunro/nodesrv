import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {format} from "../../../support/string"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import SimpleAction from "../simpleAction"

@injectable()
export default class AttributesAction extends SimpleAction {
  constructor(@inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Attributes)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const attributes = requestService.getMob().attribute().combine()
    return requestService.respondWith().info(format(
      Messages.Attributes.Info,
      attributes.str,
      attributes.int,
      attributes.wis,
      attributes.dex,
      attributes.con,
      attributes.sta))
  }
}
