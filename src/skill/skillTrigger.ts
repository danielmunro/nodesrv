import { Mob } from "../mob/model/mob"
import { Trigger } from "../trigger"
import { Skill } from "./model/skill"
import { getSkillAction } from "./skillCollection"
import { SkillTriggerEvent } from "./skillTriggerEvent"

export enum SkillEventResolution {
  SKILL_INVOKED,
  SKILL_FAILED,
}

function filterBySkillTrigger(skill: Skill, trigger: Trigger) {
  return getSkillAction(skill.skillType).triggers.some((skillTrigger) => skillTrigger === trigger)
}

export function createSkillTriggerEvent(mob: Mob, skillTrigger: Trigger): SkillTriggerEvent {
  const event = new SkillTriggerEvent(mob, skillTrigger)
  mob.skills
    .filter((skill) => filterBySkillTrigger(skill, skillTrigger))
    .forEach(async (skill: Skill) =>
      await getSkillAction(skill.skillType).action.execute(event))
  return event
}
