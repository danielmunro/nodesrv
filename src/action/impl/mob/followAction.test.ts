import {Mob} from "../../../mob/model/mob"
import {Player} from "../../../player/model/player"
import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"

let testBuilder: TestBuilder
let player: Player
let target: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  player = (await testBuilder.withPlayer()).player
  target = testBuilder.withMob().mob
})

describe("follow action", () => {
  it("should be able to work successfully", async () => {
    // when
    const response = await testBuilder.handleAction(RequestType.Follow, `follow '${target.name}'`)

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(`you begin following ${target.name}.`)
    expect(response.message.getMessageToTarget()).toBe(`${player.sessionMob.name} begins following you.`)
    expect(response.message.getMessageToObservers()).toBe(`${player.sessionMob.name} begins following ${target.name}.`)
  })
})
