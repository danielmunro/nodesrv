import { Item } from "../item/model/item"
import Table from "../mob/table"
import RequestBuilder from "../request/requestBuilder"
import { RequestType } from "../request/requestType"
import { newSkill } from "../skill/factory"
import { MESSAGE_FAIL_TOO_TIRED } from "../skill/preconditions/sneak"
import { SkillType } from "../skill/skillType"
import { getTestPlayer } from "../test/player"
import TestBuilder from "../test/testBuilder"
import { doSkill, doWithItemOrElse } from "./actionHelpers"
import { Definition } from "./definition/definition"

describe("actions helpers", () => {
  it("should do with item or else", () => {
    const doNotUseCallback = jest.fn()
    const useCallback = jest.fn()
    expect.assertions(2)
    return Promise.all([
      doWithItemOrElse(
        jest.fn(),
        null,
        doNotUseCallback,
        ""),
      doWithItemOrElse(
        jest.fn(),
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
    // setup
    const testBuilder = new TestBuilder()
    const defaultHandler = new Definition(
      await testBuilder.getService(),
      RequestType.Any,
      () => Promise.resolve(defaultHandler))
    const actions = await testBuilder.getActionCollection()
    const player = getTestPlayer()
    const requestBuilder = new RequestBuilder(player, new Table([player.sessionMob]))
    const handleRepeater = (requestType: RequestType, args: string) =>
      actions.getMatchingHandlerDefinitionForRequestType(requestType, defaultHandler)
        .handle(requestBuilder.create(requestType, args))

    // expect
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
    const requestBuilder = new RequestBuilder(player, new Table([mob]))

    // when
    await doSkill(requestBuilder.create(RequestType.Sneak), SkillType.Sneak)

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
    const requestBuilder = new RequestBuilder(player, new Table([mob]))

    // when
    const response = await doSkill(requestBuilder.create(RequestType.Sneak), SkillType.Sneak)

    // then
    expect(response.message).toBe(MESSAGE_FAIL_TOO_TIRED)
  })
})
