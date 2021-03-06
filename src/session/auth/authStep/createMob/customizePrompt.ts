import {MobEntity} from "../../../../mob/entity/mobEntity"
import Customization from "../../../../mob/specialization/customization"
import FormatterService from "../../../../mob/specialization/service/formatterService"
import match from "../../../../support/matcher/match"
import {format} from "../../../../support/string"
import {CreationMessages} from "../../constants"
import Request from "../../request"
import Response from "../../response"
import AuthStep from "../authStep"
import PlayerAuthStep from "../playerAuthStep"
import Complete from "./complete"
import {CustomizeCommand} from "./customizeCommand"

const BASE_EXPERIENCE_PER_LEVEL = 1000

export default class CustomizePrompt extends PlayerAuthStep implements AuthStep {
  private static calculateExperiencePerLevel(mob: MobEntity): number {
    return Math.max(BASE_EXPERIENCE_PER_LEVEL, mob.race().creationPoints
    + mob.playerMob.getCreationPoints())
  }

  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.Mob.CustomizePrompt
  }

  public async processRequest(request: Request): Promise<Response> {
    const mob = this.player.sessionMob
    const input = request.getContextAsInput()
    if (match(CustomizeCommand.Add, input.command)) {
      return this.add(mob, input.subject, request)
    } else if (match(CustomizeCommand.Remove, input.command)) {
      return this.remove(mob, input.subject, request)
    } else if (match(CustomizeCommand.Learned, input.command)) {
      return this.learned(mob, request)
    } else if (match(CustomizeCommand.List, input.command)) {
      return this.list(mob, request)
    } else if (match(CustomizeCommand.Done, input.command)) {
      return this.done(mob, request)
    } else if (match(CustomizeCommand.Help, input.command)) {
      return request.ok(this, CreationMessages.Mob.Help)
    }
    return request.fail(this, CreationMessages.Mob.CustomizeFail)
  }

  private remove(mob: MobEntity, subject: string, request: Request): Response {
    return this.creationService.getKnownCustomization(mob, subject)
      .maybe(toRemove => {
        mob.playerMob.customizations = mob.playerMob.customizations.filter(specialization =>
          specialization !== toRemove)

        return request.ok(this, format("{0} has been removed", toRemove.getName()))
      })
      .or(() => this.creationService.getUnknownCustomization(mob, subject)
        .maybe(() => request.fail(this, CreationMessages.Mob.NotKnown))
        .or(() => request.fail(this, CreationMessages.All.NotFound))
        .get())
      .get()
  }

  private add(mob: MobEntity, subject: string, request: Request): Response {
    return this.creationService.getUnknownCustomization(mob, subject)
      .maybe(customization => this.addCustomization(mob, customization, request))
      .or(() => this.checkIfCustomizationAlreadyExists(mob, subject, request))
      .get()
  }

  private addCustomization(mob: MobEntity, customization: Customization, request: Request): Response {
    mob.playerMob.customizations.push(customization)
    return request.ok(this, format("{0} has been added", customization.getName()))
  }

  private checkIfCustomizationAlreadyExists(mob: MobEntity, subject: string, request: Request) {
    return this.creationService.getKnownCustomization(mob, subject)
      .maybe(customization => request.fail(this, format(CreationMessages.Mob.AlreadyKnown, customization.getName())))
      .or(() => request.fail(this, CreationMessages.All.NotFound))
      .get()
  }

  private learned(mob: MobEntity, request: Request): Response {
    const specializationGroups = this.creationService.getKnownSpecializationGroups(mob)
    const skills = this.creationService.getKnownSkills(mob)

    return request.ok(this, new FormatterService(specializationGroups, skills).format()
      + format(
        "you have {0} creation points, and {1} experience per level.",
        mob.getCreationPoints(),
        CustomizePrompt.calculateExperiencePerLevel(mob)))
  }

  private list(mob: MobEntity, request: Request): Response {
    const specializationGroups = this.creationService.getUnknownSpecializationGroups(mob)
    const skills = this.creationService.getUnknownSkills(mob)

    return request.ok(this, new FormatterService(specializationGroups, skills).format()
      + format(
        "you have {0} creation points, and {1} experience per level.",
        mob.playerMob.getCreationPoints(),
        CustomizePrompt.calculateExperiencePerLevel(mob)))
  }

  private done(mob: MobEntity, request: Request): Response {
    mob.playerMob.experiencePerLevel =
      CustomizePrompt.calculateExperiencePerLevel(mob)
    return request.ok(new Complete(this.creationService, this.player), CreationMessages.All.Done)
  }
}
