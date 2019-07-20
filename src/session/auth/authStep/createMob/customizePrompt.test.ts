import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {Client} from "../../../../client/client"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {PlayerEntity} from "../../../../player/entity/playerEntity"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {CreationMessages} from "../../constants"
import Request from "../../request"
import CreationService from "../../service/creationService"
import CustomizePrompt from "./customizePrompt"

let testRunner: TestRunner
let customizePrompt: CustomizePrompt
let client: Client
let player: PlayerEntity

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  client = testRunner.createClient()
  player = (await testRunner.createPlayer()).get()
  await client.session.login(client, player)
  customizePrompt = new CustomizePrompt(
    app.get<CreationService>(Types.CreationService), player)
})

describe("customize prompt auth step", () => {
  it("input that is not a command should fail", async () => {
    // when
    const response = await customizePrompt.processRequest(new Request(client, "foo"))

    // then
    expect(response.message).toBe(CreationMessages.Mob.CustomizeFail)
  })

  describe("list command", () => {
    it("can list available skills and spells", async () => {
      // when
      const response = await customizePrompt.processRequest(new Request(client, "list"))

      // then
      expect(response.message).toContain("group")
      expect(response.message).toContain("creation points")
      expect(response.message).toContain("bash")
      expect(response.message).toContain("polearm")
      expect(response.message).toContain("you have 0 creation points, and 1000 experience per level.")
    })

    it("does not list known groups", async () => {
      // setup
      player.sessionMob.specializationType = SpecializationType.Cleric

      // given
      await customizePrompt.processRequest(new Request(client, "add healing"))

      // when
      const response = await customizePrompt.processRequest(new Request(client, "list"))

      // then
      expect(response.message).not.toContain("healing")
    })
  })

  describe("add command", () => {
    it("adds a group", async () => {
      // given
      player.sessionMob.specializationType = SpecializationType.Mage

      // when
      const response = await customizePrompt.processRequest(new Request(client, "add trans"))

      // then
      expect(response.message).toBe("transportation has been added")
      expect(player.sessionMob.playerMob.customizations).toHaveLength(1)
    })

    it("cannot add the same group twice", async () => {
      // setup
      player.sessionMob.specializationType = SpecializationType.Mage

      // given
      await customizePrompt.processRequest(new Request(client, "add trans"))

      // when
      const response = await customizePrompt.processRequest(new Request(client, "add trans"))

      // then
      expect(response.message).toBe("You already know transportation.")
    })

    it("cannot add unknown groups", async () => {
      // setup
      player.sessionMob.specializationType = SpecializationType.Mage

      // when
      const response = await customizePrompt.processRequest(new Request(client, "add shibolleh"))

      // then
      expect(response.message).toBe(CreationMessages.All.NotFound)
    })
  })

  describe("remove command", () => {
    it("removes an added group", async () => {
      // setup
      player.sessionMob.specializationType = SpecializationType.Cleric

      // given
      await customizePrompt.processRequest(new Request(client, "add healing"))

      // when
      const response = await customizePrompt.processRequest(new Request(client, "remove healing"))

      // then
      expect(response.message).toBe("healing has been removed")
      expect(player.sessionMob.playerMob.customizations).toHaveLength(0)
    })

    it("cannot remove a group that is not added", async () => {
      // setup
      player.sessionMob.specializationType = SpecializationType.Cleric

      // when
      const response = await customizePrompt.processRequest(new Request(client, "remove healing"))

      // then
      expect(response.message).toBe(CreationMessages.Mob.NotKnown)
    })

    it("cannot remove a nonsense group", async () => {
      // setup
      player.sessionMob.specializationType = SpecializationType.Cleric

      // when
      const response = await customizePrompt.processRequest(new Request(client, "remove shibolleh"))

      // then
      expect(response.message).toBe(CreationMessages.All.NotFound)
    })
  })
})
