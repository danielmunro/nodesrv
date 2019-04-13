import EventService from "../event/eventService"
import ActionService from "../gameService/actionService"
import GameService from "../gameService/gameService"
import StateService from "../gameService/stateService"
import TimeService from "../gameService/timeService"
import MobService from "../mob/mobService"
import WeatherService from "../region/weatherService"
import { getTestRoom } from "../support/test/room"
import newServer from "./factory"

describe("game server factory", () => {
  it("should not start if passed a bad port", async () => {
    const startRoom = getTestRoom()
    const service = new GameService(
      new MobService(null, null, null, null),
      new ActionService([], [], []),
      new StateService(
        new WeatherService(),
        new TimeService()))
    await expect(newServer(
      service, 1, startRoom, null, null, new EventService(), null, null)).rejects.toThrowError()
    await expect(newServer(
      service, 999999999, startRoom, null, null, new EventService(), null, null)).rejects.toThrowError()
    await expect(newServer(
      service, 22, startRoom, null, null, new EventService(), null, null)).rejects.toThrowError()
    await expect(newServer(
      service, null, startRoom, null, null, new EventService(), null, null)).rejects.toThrowError()
  })
})
