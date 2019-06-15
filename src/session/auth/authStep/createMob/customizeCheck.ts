import FormatterService from "../../../../mob/specialization/service/formatterService"
import {CreationMessages} from "../../constants"
import Request from "../../request"
import Response from "../../response"
import AuthStep from "../authStep"
import PlayerAuthStep from "../playerAuthStep"
import Complete from "./complete"
import CustomizePrompt from "./customizePrompt"

export default class CustomizeCheck extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.Mob.CustomizeCheck
  }

  public async processRequest(request: Request): Promise<Response> {
    if (request.didDeny()) {
      return request.ok(new Complete(this.creationService, this.player))
    }

    if (request.didConfirm()) {
      const specializationGroups = this.creationService.getUnknownSpecializationGroups(this.player.sessionMob)
      const skills = this.creationService.getUnknownSkills(this.player.sessionMob)
      const formatterService = new FormatterService(specializationGroups, skills)
      request.client.sendMessage(formatterService.format())
      return request.ok(new CustomizePrompt(this.creationService, this.player))
    }

    return request.fail(this, CreationMessages.All.ConfirmFailed)
  }
}
