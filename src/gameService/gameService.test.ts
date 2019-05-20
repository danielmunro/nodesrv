import {createTestAppContainer} from "../app/testFactory"
import {Direction} from "../room/enum/direction"
import TestRunner from "../support/test/testRunner"
import {Types} from "../support/types"
import GameService from "./gameService"

let testRunner: TestRunner
let gameService: GameService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  gameService = app.get<GameService>(Types.GameService)
})

describe("moveMob", () => {
  it("does not allow movement where an exit does not exist", async () => {
    // setup
    const mob = testRunner.createMob()

    // expect
    return expect(gameService.moveMob(mob.get(), Direction.North)).rejects.toThrowError()
  })

  it("should allow movement where a direction exists", async () => {
    // setup
    const destination = testRunner.createRoom(Direction.North).get()
    const mob = testRunner.createMob().get()

    // when
    await gameService.moveMob(mob, Direction.North)

    // then
    const location = gameService.getMobLocation(mob)
    expect(location.room.uuid).toBe(destination.uuid)
  })

  it("sanity checks with mob rooms and location", async () => {
    // given
    const room1 = testRunner.getStartRoom().get()
    const room2 = testRunner.createRoom().get()
    const mob1 = testRunner.createMob().get()
    const mob2 = testRunner.createMob().get()

    // expect
    expect(gameService.getMobsByRoom(room1)).toHaveLength(2)
    expect(gameService.getMobsByRoom(room2)).toHaveLength(0)

    // and
    expect(gameService.getMobLocation(mob1).room).toBe(room1)
    expect(gameService.getMobLocation(mob2).room).toBe(room1)
  })
})
