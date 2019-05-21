import { AffectType } from "../../../affect/enum/affectType"
import {newAffect} from "../../../affect/factory/affectFactory"
import {createTestAppContainer} from "../../../app/testFactory"
import {Item} from "../../../item/model/item"
import { RequestType } from "../../../request/enum/requestType"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner
let playerBuilder: PlayerBuilder
let item: Item

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  playerBuilder = testRunner.createPlayer()
  item = testRunner.createItem()
    .asFood()
    .build()
  playerBuilder.addItem(item)
})

describe("eat action", () => {
  it("should remove food from inventory when consumed", async () => {
    // when
    await testRunner.invokeAction(RequestType.Eat, `eat ${item.name}`)

    // then
    expect(playerBuilder.getItems()).toHaveLength(0)
    expect(playerBuilder.getMob().playerMob.hunger).toBe(item.hunger)
  })

  it("should notify if the player has full", async () => {
    // given
    const mob = playerBuilder.getMob()
    mob.playerMob.hunger = mob.race().appetite - 1

    // when
    const response = await testRunner.invokeAction(RequestType.Eat, `eat ${item.name}`)

    // then
    expect(response.getMessageToRequestCreator()).toContain("You feel full")
  })

  it ("should notify if the player receives an affect from eating", async () => {
    // given
    item.affect().add(newAffect(AffectType.Poison))

    // when
    const response = await testRunner.invokeAction(RequestType.Eat, `eat ${item.name}`)

    // then
    expect(response.getMessageToRequestCreator()).toContain("and suddenly feel different")
  })

  it("should not allow eating food not in inventory", async () => {
    // given
    playerBuilder.getMob().inventory.removeItem(item)

    // when
    const response = await testRunner.invokeAction(RequestType.Eat, `eat ${item.name}`)

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Item.NotOwned)
  })

  it("should not allow eating items that are not food", async () => {
    // given
    const eq = testRunner.createItem()
      .asHelmet()
      .build()
    playerBuilder.addItem(eq)

    // when
    const response = await testRunner.invokeAction(RequestType.Eat, "eat cap")

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Eat.NotFood)
  })

  it("should not allow eating when already full", async () => {
    // given
    playerBuilder.setHunger(playerBuilder.player.sessionMob.race().appetite)

    // when
    const response = await testRunner.invokeAction(RequestType.Eat, `eat ${item.name}`)

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Eat.AlreadyFull)
  })

  it("should allow eating when all conditions are met", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Eat, `eat ${item.name}`)

    // then
    expect(response.isSuccessful()).toBeTruthy()
  })
})
