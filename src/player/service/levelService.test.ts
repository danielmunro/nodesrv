import {createTestAppContainer} from "../../app/factory/testFactory"
import KafkaService from "../../kafka/kafkaService"
import {MAX_MOB_LEVEL} from "../../mob/constants"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import LevelService from "./levelService"

const INITIAL_AMOUNT = 1000
let testRunner: TestRunner
let kafkaService: KafkaService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  kafkaService = app.get<KafkaService>(Types.KafkaService)
})

describe("level service", () => {
  it("will report if a mob can level successfully", async () => {
    // setup
    const player = testRunner.createPlayer()
    const levelService = new LevelService(kafkaService, player.getMob())

    // when
    player.getMob().playerMob.experienceToLevel = 1

    // then
    expect(levelService.canMobLevel()).toBeFalsy()

    // and when
    player.getMob().playerMob.experienceToLevel = 0

    // then
    expect(levelService.canMobLevel()).toBeTruthy()
  })

  it("won't allow leveling beyond mob max level", async () => {
    // setup
    const player = testRunner.createPlayer()
    const levelService = new LevelService(kafkaService, player.getMob())
    player.getMob().level = MAX_MOB_LEVEL

    // when
    player.getMob().playerMob.experienceToLevel = 0

    // then
    expect(levelService.canMobLevel()).toBeFalsy()
  })

  it("can generate a gain, sanity check", async () => {
    // setup
    const player = testRunner.createPlayer()
    const levelService = new LevelService(kafkaService, player.getMob())
    const playerMob = player.getMob().playerMob
    playerMob.experiencePerLevel = INITIAL_AMOUNT
    playerMob.experienceToLevel = INITIAL_AMOUNT
    playerMob.addExperience(INITIAL_AMOUNT)

    // when
    const gain = await levelService.gainLevel()

    // then
    expect(levelService.canMobLevel()).toBeFalsy()
    expect(gain.newLevel).toBe(player.getMob().level)
    expect(gain.practices).toBeGreaterThan(0)
    expect(playerMob.experienceToLevel).toBe(playerMob.experiencePerLevel)
  })
})
