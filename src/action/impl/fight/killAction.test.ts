import {CheckStatus} from "../../../check/checkStatus"
import { RequestType } from "../../../request/requestType"
import { ResponseStatus } from "../../../request/responseStatus"
import {getTestMob} from "../../../test/mob"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {MESSAGE_FAIL_KILL_NO_TARGET} from "../../constants"
import {MESSAGE_FAIL_KILL_ALREADY_FIGHTING} from "../../constants"

let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Kill)
})

describe("kill", () => {
  it("should be able to kill a mob in the same room", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.player.sessionMob.name = "alice"
    const target = testBuilder.withMob("bob").mob

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Kill, `kill ${target.name}`, target))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe("you scream and attack bob!")
    expect(response.message.getMessageToTarget()).toBe("alice screams and attacks you!")
    expect(response.message.getMessageToObservers()).toBe("alice screams and attacks bob!")
  })

  it("should not be able to kill a mob that isn't in the room", async () => {
    // given
    const target = getTestMob()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Kill, `kill ${target.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_KILL_NO_TARGET)
  })

  it("shouldn't be able to target a mob when already fighting", async () => {
    // given
    testBuilder.withRoom()
    await testBuilder.withPlayer()
    const mob1 = testBuilder.withMob("bob").mob
    const mob2 = testBuilder.withMob("alice").mob

    // and
    await testBuilder.fight(mob1)

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Kill, `kill ${mob2.name}`, mob2))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_KILL_ALREADY_FIGHTING)
  })

  it("should be able to kill a mob in the same room", async () => {
    // given
    await testBuilder.withPlayer()
    const target = testBuilder.withMob("bob").mob

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Kill, `kill ${target.name}`, target))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result.id).toBe(target.id)
  })
})
