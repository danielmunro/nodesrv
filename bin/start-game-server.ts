import * as assert from "assert"
import EventConsumer from "../src/event/eventConsumer"
import EventService from "../src/event/eventService"
import ResetService from "../src/gameService/resetService"
import createAppContainer from "../src/inversify.config"
import {tick} from "../src/server/constants"
import {DecrementAffects} from "../src/server/observers/decrementAffects"
import {DecrementPlayerDelay} from "../src/server/observers/decrementPlayerDelay"
import {FightRounds} from "../src/server/observers/fightRounds"
import {HandleClientRequests} from "../src/server/observers/handleClientRequests"
import {ObserverChain} from "../src/server/observers/observerChain"
import {PersistPlayers} from "../src/server/observers/persistPlayers"
import {RegionWeather} from "../src/server/observers/regionWeather"
import Respawner from "../src/server/observers/respawner"
import {Tick} from "../src/server/observers/tick"
import {Wander} from "../src/server/observers/wander"
import {GameServer} from "../src/server/server"
import { initializeConnection } from "../src/support/db/connection"
import {DiceRoller} from "../src/support/random/dice"
import {FiveMinuteTimer} from "../src/support/timer/fiveMinuteTimer"
import {MinuteTimer} from "../src/support/timer/minuteTimer"
import {RandomTickTimer} from "../src/support/timer/randomTickTimer"
import {SecondIntervalTimer} from "../src/support/timer/secondTimer"
import {ShortIntervalTimer} from "../src/support/timer/shortIntervalTimer"
import {Types} from "../src/support/types"

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
  const resetService = app.get<ResetService>(Types.ResetService)
  console.time(Timings.seedMobs)
  await resetService.seedMobTable()
  console.timeEnd(Timings.seedMobs)
  console.time(Timings.seedItems)
  await resetService.seedItemRoomResets()
  console.timeEnd(Timings.seedItems)

  const server = app.get<GameServer>(Types.GameServer)
  server.addObserver(new ObserverChain([
    app.get<Tick>(Types.TickObserver),
    app.get<DecrementAffects>(Types.DecrementAffectObserver),
    app.get<Wander>(Types.WanderObserver),
  ]), new RandomTickTimer(
    new DiceRoller(tick.dice.sides, tick.dice.rolls, tick.dice.modifier)))
  server.addObserver(app.get<PersistPlayers>(Types.PersistPlayersObservers), new MinuteTimer())
  server.addObserver(app.get<RegionWeather>(Types.RegionWeatherObserver), new MinuteTimer())
  server.addObserver(app.get<FightRounds>(Types.FightRoundsObserver), new SecondIntervalTimer())
  server.addObserver(app.get<Respawner>(Types.RespawnerObserver), new FiveMinuteTimer())
  server.addObserver(new DecrementPlayerDelay(), new SecondIntervalTimer())
  server.addObserver(new HandleClientRequests(), new ShortIntervalTimer())

  const eventConsumerTable = await app.get<EventConsumer[]>(Types.EventConsumerTable)() as EventConsumer[]
  const eventService = app.get<EventService>(Types.EventService)
  eventConsumerTable.forEach(eventConsumer => eventService.addConsumer(eventConsumer))

  await server.start()

  console.timeEnd(Timings.init)
})
