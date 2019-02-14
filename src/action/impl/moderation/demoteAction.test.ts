import {Mob} from "../../../mob/model/mob"
import {AuthorizationLevel} from "../../../player/authorizationLevel"
import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

let testBuilder: TestBuilder
let mob1: Mob
let mob2: Mob
let action: Action
const mobToDemote = "bob"

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mob1 = (await testBuilder.withPlayer()).player.sessionMob
  mob1.playerMob.authorizationLevel = AuthorizationLevel.Immortal
  mob2 = (await testBuilder.withPlayer()).player.sessionMob
  mob2.name = mobToDemote
  action = await testBuilder.getActionDefinition(RequestType.Demote)
})

describe("demote moderation action", () => {
  it("cannot demote immortals", async () => {
    mob2.playerMob.authorizationLevel = AuthorizationLevel.Immortal
    const response = await action.handle(testBuilder.createRequest(RequestType.Demote, `demote ${mobToDemote}`))
    expect(response.message.getMessageToRequestCreator()).toBe("Immortals cannot be demoted.")
  })

  it("demotes judges sanity check", async () => {
    mob2.playerMob.authorizationLevel = AuthorizationLevel.Judge
    const response = await action.handle(testBuilder.createRequest(RequestType.Demote, `demote ${mobToDemote}`))
    expect(response.message.getMessageToRequestCreator()).toBe("You demoted bob to admin.")
  })

  it("demotes admins sanity check", async () => {
    mob2.playerMob.authorizationLevel = AuthorizationLevel.Admin
    const response = await action.handle(testBuilder.createRequest(RequestType.Demote, `demote ${mobToDemote}`))
    expect(response.message.getMessageToRequestCreator()).toBe("You demoted bob to mortal.")
  })

  it("demotes mortals sanity check", async () => {
    mob2.playerMob.authorizationLevel = AuthorizationLevel.Mortal
    const response = await action.handle(testBuilder.createRequest(RequestType.Demote, `demote ${mobToDemote}`))
    expect(response.message.getMessageToRequestCreator()).toBe("bob has no more demotions.")
  })
})
