import {Disposition} from "../mob/enum/disposition"
import MobService from "../mob/mobService"
import {Request} from "../request/request"
import CheckBuilder from "./checkBuilder"
import CheckTemplate from "./checkTemplate"

export default class CheckBuilderFactory {
  constructor(private readonly mobService: MobService) {}

  public createCheckBuilder(request: Request, disposition: Disposition = Disposition.Any): CheckBuilder {
    return new CheckBuilder(this.mobService, request)
      .requireDisposition(disposition, `You must be ${disposition} to do that.`)
  }

  public createCheckTemplate(request: Request): CheckTemplate {
    return new CheckTemplate(this.mobService, request)
  }
}
