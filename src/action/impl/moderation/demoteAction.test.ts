import {createTestAppContainer} from "../../../app/factory/testFactory"
import {AuthorizationLevel} from "../../../player/authorizationLevel"
import {RequestType} from "../../../request/enum/requestType"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {MESSAGE_FAIL_CANNOT_DEMOTE_IMMORTALS} from "../../constants"

let testRunner: TestRunner
let playerToDemote: PlayerBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.createPlayer()
    .setAuthorizationLevel(AuthorizationLevel.Immortal)
  playerToDemote = testRunner.createPlayer()
})

describe("demote moderation action", () => {
  it("cannot demote immortals", async () => {
    // given
    playerToDemote.setAuthorizationLevel(AuthorizationLevel.Immortal)

    // when
    const response = await testRunner.invokeAction(RequestType.Demote, `demote '${playerToDemote.getMobName()}'`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FAIL_CANNOT_DEMOTE_IMMORTALS)
  })

  it("demotes judges sanity check", async () => {
    // given
    playerToDemote.setAuthorizationLevel(AuthorizationLevel.Judge)

    // when
    const response = await testRunner.invokeAction(RequestType.Demote, `demote '${playerToDemote.getMobName()}'`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`You demoted ${playerToDemote.getMobName()} to admin.`)
  })

  it("demotes admins sanity check", async () => {
    // given
    playerToDemote.setAuthorizationLevel(AuthorizationLevel.Admin)

    // when
    const response = await testRunner.invokeAction(RequestType.Demote, `demote '${playerToDemote.getMobName()}'`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`You demoted ${playerToDemote.getMobName()} to mortal.`)
  })

  it("demotes mortals sanity check", async () => {
    // given
    playerToDemote.setAuthorizationLevel(AuthorizationLevel.Mortal)

    // when
    const response = await testRunner.invokeAction(RequestType.Demote, `demote '${playerToDemote.getMobName()}'`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${playerToDemote.getMobName()} has no more demotions.`)
  })
})
