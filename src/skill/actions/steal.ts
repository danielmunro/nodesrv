import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import { CheckType } from "../../check/checkType"
import { Mob } from "../../mob/model/mob"
import { Skill } from "../model/skill"
import { SkillType } from "../skillType"
import { Messages } from "./constants"
import roll from "../../random/dice"
import { ActionOutcome } from "../../action/actionOutcome"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const mob = checkedRequest.mob
  const target = checkedRequest.request.getTarget() as Mob
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  let actionOutcome: ActionOutcome
  const replacements = { item, target }

  if (calculateStealSaves(mob, skill) < calculateStealSaves(target, target.findSkill(SkillType.Steal))) {
    if (roll(1, 3) === 1) {
      actionOutcome = ActionOutcome.FightStarted
    }

    return checkedRequest
      .respondWith(actionOutcome)
      .fail(
        Messages.Steal.Failure,
        { verb: "fail", ...replacements },
        actionOutcome ? { verb: "fails", target: "you", ...replacements } : null,
        actionOutcome ? { verb: "fails", ...replacements } : null)
  }

  mob.inventory.addItem(item)

  if (roll(1, 5) === 1) {
    actionOutcome = ActionOutcome.FightStarted
  }

  return checkedRequest
    .respondWith(actionOutcome)
    .success(
      Messages.Steal.Success,
      actionOutcome ? { verb: "steal", ...replacements } : null,
      actionOutcome ? { verb: "steals", item, target: "you" } : null)
}

function calculateStealSaves(mob: Mob, skill: Skill) {
  const combined = mob.getCombinedAttributes()

  return roll(4, (combined.stats.dex / 5) + ((skill ? skill.level : 10) / 10) + (mob.level / 5))
}
