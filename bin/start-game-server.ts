import * as assert from "assert"
import createAppContainer from "../src/app/factory/factory"
import {tick} from "../src/server/constants"
import {ObserverChain} from "../src/server/observers/observerChain"
import { initializeConnection } from "../src/support/db/connection"
import {DiceRoller} from "../src/support/random/dice"
import {FiveMinuteTimer} from "../src/support/timer/fiveMinuteTimer"
import {MinuteTimer} from "../src/support/timer/minuteTimer"
import {RandomTickTimer} from "../src/support/timer/randomTickTimer"
import {SecondIntervalTimer} from "../src/support/timer/secondTimer"
import {ShortIntervalTimer} from "../src/support/timer/shortIntervalTimer"

const Timings = {
  init: "total game initialization",
  itemService: "item service",
  openPort: "open server port",
  resetService: "create reset service initialization",
  roomAndMobTables: "room, mob, and exit table initialization",
  seedItems: "seeding items",
  seedMobs: "seeding world",
}

/**
 * Obtain the start room ID and port from arguments passed in
 */
const startRoomID = +process.argv[2]
const port = +process.argv[3]
console.time(Timings.init)
assert.ok(startRoomID, "start room ID has required to be defined")
console.log(`startup parameters:  port: ${port}, room: ${startRoomID}`)

initializeConnection().then(async () => {
  const app = await createAppContainer(startRoomID, port)

  /**
   * seed mob and item resets
   */
  const resetService = app.getResetService()
  console.time(Timings.seedMobs)
  await resetService.seedMobTable()
  console.timeEnd(Timings.seedMobs)
  console.time(Timings.seedItems)
  await resetService.seedItemRoomResets()
  console.timeEnd(Timings.seedItems)

  /**
   * server observers
   */
  const server = app.getGameServer()
  const observers = app.getObservers()
  server.addObserver(new ObserverChain([
    observers.getTickObserver(),
    observers.getDecrementAffectsObserver(),
    observers.getWanderObserver(),
  ]), new RandomTickTimer(
    new DiceRoller(tick.dice.sides, tick.dice.rolls, tick.dice.modifier)))
  server.addObserver(observers.getPersistPlayersObserver(), new MinuteTimer())
  server.addObserver(observers.getRegionWeatherObserver(), new MinuteTimer())
  server.addObserver(observers.getFightRoundsObserver(), new SecondIntervalTimer())
  server.addObserver(observers.getRespawnerObserver(), new FiveMinuteTimer())
  server.addObserver(observers.getDecrementPlayerDelayObserver(), new SecondIntervalTimer())
  server.addObserver(observers.getHandleClientRequestsObserver(), new ShortIntervalTimer())

  /**
   * event service consumers
   */
  const eventConsumerTable = app.getEventConsumerTable()
  const eventService = app.getEventService()
  eventConsumerTable.forEach(eventConsumer => eventService.addConsumer(eventConsumer))

  /**
   * start the game
   */
  await server.start()
  console.timeEnd(Timings.init)
})
