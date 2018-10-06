import { Item } from "../item/model/item"
import { MAX_PRACTICE_LEVEL } from "../mob/constants"
import InputContext from "../request/context/inputContext"
import { Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { newSkill } from "../skill/factory"
import { Messages } from "../skill/preconditions/constants"
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
    const handleRepeater = (requestType: RequestType, args: string) =>
      actions.getMatchingHandlerDefinitionForRequestType(
        requestType,
        player.sessionMob.playerMob.authorizationLevel,
        defaultHandler).handle(new Request(player.sessionMob, new InputContext(requestType, args)))

    // expect
    expect(await handleRepeater(RequestType.Noop, "")).toBe(defaultHandler)
    expect(await handleRepeater(RequestType.North, "north")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.South, "south")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.East, "east")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.West, "west")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.Up, "up")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.Down, "down")).not.toBe(defaultHandler)
  })
})
