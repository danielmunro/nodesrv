import {inject, injectable} from "inversify"
import "reflect-metadata"
import {Disposition} from "../../mob/enum/disposition"
import MobService from "../../mob/service/mobService"
import Request from "../../request/request"
import {Types} from "../../support/types"
import CheckBuilder from "../builder/checkBuilder"
import CheckTemplateBuilder from "../builder/checkTemplateBuilder"
import getActionPartTable from "../table/actionPartCheckTable"

@injectable()
export default class CheckBuilderFactory {
  constructor(@inject(Types.MobService) private readonly mobService: MobService) {}

  public createCheckBuilder(request: Request, disposition: Disposition = Disposition.Any): CheckBuilder {
    return new CheckBuilder(this.mobService, request, getActionPartTable(this.mobService))
      .requireDisposition(disposition, `You must be ${disposition} to do that.`)
  }

  public createCheckTemplate(request: Request): CheckTemplateBuilder {
    return new CheckTemplateBuilder(this.mobService, request)
  }
}
