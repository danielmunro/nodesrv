import {Disposition} from "../mob/enum/disposition"
import MobService from "../mob/service/mobService"
import Request from "../request/request"
import CheckBuilder from "./builder/checkBuilder"
import CheckTemplateService from "./service/checkTemplateService"
import getActionPartTable from "./table/actionPartCheckTable"

export default class CheckBuilderFactory {
  constructor(private readonly mobService: MobService) {}

  public createCheckBuilder(request: Request, disposition: Disposition = Disposition.Any): CheckBuilder {
    return new CheckBuilder(this.mobService, request, getActionPartTable(this.mobService))
      .requireDisposition(disposition, `You must be ${disposition} to do that.`)
  }

  public createCheckTemplate(request: Request): CheckTemplateService {
    return new CheckTemplateService(this.mobService, request)
  }
}
