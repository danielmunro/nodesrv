import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import {EventType} from "../../event/eventType"
import GameService from "../../gameService/gameService"
import MobEvent from "../../mob/event/mobEvent"
import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import Response from "../../request/response"
import { Skill } from "../model/skill"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

async function startFight(service, checkedRequest) {
  await service.publishEvent(new MobEvent(EventType.Attack, checkedRequest.mob, checkedRequest.request.getTarget()))
}

export default async function(checkedRequest: CheckedRequest, service: GameService): Promise<Response> {
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const mob = checkedRequest.mob
  const target = checkedRequest.request.getTarget() as Mob
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  const replacements = { item, target }
  let success = true

  if (calculateStealSaves(mob, skill) < calculateStealSaves(target, target.findSkill(SkillType.Steal))) {
    if (roll(1, 3) === 1) {
      await startFight(service, checkedRequest)
      success = false
    }

    return checkedRequest
      .respondWith()
      .fail(
        Messages.Steal.Failure,
        { verb: "fail", ...replacements },
        success ? { verb: "fails", target: "you", ...replacements } : null,
        success ? { verb: "fails", ...replacements } : null)
  }

  mob.inventory.addItem(item)

  if (roll(1, 5) === 1) {
    await startFight(service, checkedRequest)
    success = false
  }

  return checkedRequest
    .respondWith()
    .success(
      Messages.Steal.Success,
      success ? { verb: "steal", ...replacements } : null,
      success ? { verb: "steals", item, target: "you" } : null)
}

function calculateStealSaves(mob: Mob, skill: Skill) {
  const combined = mob.getCombinedAttributes()

  return roll(4, (combined.stats.dex / 5) + ((skill ? skill.level : 10) / 10) + (mob.level / 5))
}
