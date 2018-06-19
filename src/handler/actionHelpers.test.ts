import { Item } from "../item/model/item"
import { createRequestArgs, Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { getTestPlayer } from "../test/player"
import { actions } from "./actionCollection"
import { doSkill, doWithItemOrElse, PRECONDITION_FAILED } from "./actionHelpers"
import { Definition } from "./definition/definition"
import { newSkill } from "../skill/factory"
import { SkillType } from "../skill/skillType"
import { MESSAGE_FAIL_TOO_TIRED } from "../skill/preconditions/sneak"

describe("action helpers", () => {
  it("should do with item or else", () => {
    const doNotUseCallback = jest.fn()
    const useCallback = jest.fn()
    expect.assertions(2)
    return Promise.all([
      doWithItemOrElse(
        null,
        doNotUseCallback,
        ""),
      doWithItemOrElse(
        new Item(),
        useCallback,
        ""),
      ])
    .then(() => {
      expect(doNotUseCallback).not.toBeCalled()
      expect(useCallback).toBeCalled()
    })
  })

  it("should recognize all directions as valid actions", async () => {
    const defaultHandler = new Definition(
      RequestType.Any,
      () => new Promise((resolve) => resolve(defaultHandler)))
    const handleRepeater = (requestType: RequestType, args: string) =>
      actions.getMatchingHandlerDefinitionForRequestType(requestType, defaultHandler)
        .handle(new Request(getTestPlayer(), requestType, createRequestArgs(args)))

    expect(await handleRepeater(RequestType.Noop, "")).toBe(defaultHandler)
    expect(await handleRepeater(RequestType.North, "north")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.South, "south")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.East, "east")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.West, "west")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.Up, "up")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.Down, "down")).not.toBe(defaultHandler)
  })

  it("should have the cost of a skill applied", async () => {
    // given
    const player = getTestPlayer()
    const mob = player.sessionMob
    const skill = newSkill(SkillType.Sneak, 100)
    mob.skills.push(skill)
    const initialMv = mob.vitals.mv
    const initialDelay = player.delay

    // when
    await doSkill(new Request(player, RequestType.Sneak, createRequestArgs("sneak")), SkillType.Sneak)

    // then
    expect(mob.vitals.mv).toBeLessThan(initialMv)
    expect(player.delay).toBeGreaterThan(initialDelay)
  })

  it("should fail", async () => {
    // given
    const player = getTestPlayer()
    const mob = player.sessionMob
    const skill = newSkill(SkillType.Sneak, 100)
    mob.skills.push(skill)
    mob.vitals.mv = 0

    // when
    const outcome = await doSkill(new Request(player, RequestType.Sneak, createRequestArgs("sneak")), SkillType.Sneak)

    // then
    expect(outcome.wasSuccessful()).toBeFalsy()
    expect(outcome.message).toBe(PRECONDITION_FAILED)
  })
})
