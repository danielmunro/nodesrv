import { CheckStatus } from "../../check/checkStatus"
import { RequestType } from "../../request/requestType"
import { Direction } from "../../room/constants"
import { newReciprocalExit } from "../../room/factory"
import TestBuilder from "../../test/testBuilder"
import { MESSAGE_DIRECTION_DOES_NOT_EXIST } from "./constants"
import { MESSAGE_OUT_OF_MOVEMENT } from "./constants"
import move from "./move"

describe("move", () => {
  it("should not allow movement where an exit does not exist", async () => {
    // when
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()
    await testBuilder.withPlayer()
    const check = await move(testBuilder.createRequest(RequestType.North), Direction.North)

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_DIRECTION_DOES_NOT_EXIST)
  })

  it("should not allow movement when movement points are depleted", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.player.sessionMob.vitals.mv = 0
    const room1 = testBuilder.withRoom()
    const room2 = testBuilder.withRoom()
    newReciprocalExit(room1.room, room2.room, Direction.South)

    // when
    const check = await move(testBuilder.createRequest(RequestType.South), Direction.South)

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_OUT_OF_MOVEMENT)
  })

  it("should allow movement when preconditions pass", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const room1 = testBuilder.withRoom()
    const room2 = testBuilder.withRoom()
    newReciprocalExit(room1.room, room2.room, Direction.South)

    // when
    const check = await move(testBuilder.createRequest(RequestType.South), Direction.South)

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })
})
