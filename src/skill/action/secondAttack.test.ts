import doNTimes from "../../functional/times"
import { Fight } from "../../mob/fight/fight"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"

const SKILL_LEVEL = 50

describe("second attacks skill action", () => {
  it("should invoke a second attacks", async () => {
    // setup
    const mob = getTestMob()
    mob.skills.push(newSkill(SkillType.SecondAttack, SKILL_LEVEL))
    const target = getTestMob()
    const room = getTestRoom()
    room.addMob(mob)
    room.addMob(target)
    mob.level = 30
    target.level = 30

    // given
    const fight = new Fight(mob, target, room)

    // when
    const rounds = await doNTimes(10, () => fight.round())

    // then
    expect(rounds.find((round) => round.attacks.length > 1)).not.toBeUndefined()
    expect(rounds.find((round) => round.attacks.length === 1)).not.toBeUndefined()
  })
})
