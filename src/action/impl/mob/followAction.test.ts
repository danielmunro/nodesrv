import {Mob} from "../../../mob/model/mob"
import {Player} from "../../../player/model/player"
import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

let testBuilder: TestBuilder
let action: Action
let player: Player
let target: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getAction(RequestType.Follow)
  player = (await testBuilder.withPlayer()).player
  target = testBuilder.withMob().mob
})

describe("sell action", () => {
  it("should be able to work successfully", async () => {
    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Follow, `follow '${target.name}'`))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(`you begin following ${target.name}.`)
    expect(response.message.getMessageToTarget()).toBe(`${player.sessionMob.name} begins following you.`)
    expect(response.message.getMessageToObservers()).toBe(`${player.sessionMob.name} begins following ${target.name}.`)
  })
})
