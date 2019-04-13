import EventService from "../event/eventService"
import StateService from "../gameService/stateService"
import {getConnection, initializeConnection} from "../support/db/connection"
import addObservers from "./observerDecorator"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("observer decorator", () => {
  it("should call addObserver on server", async () => {
    // setup
    const mock = jest.fn(() => ({
      addObserver: jest.fn(),
      mobService: {
        locationService: {
          getMobLocationCount: jest.fn(),
        },
        mobTable: {
          getWanderingMobs: jest.fn(),
        },
        pruneDeadMobs: () => [],
      },
      resetService: {
        mobResets: [],
      },
      service: {
      },
    }))
    const mockServer = mock()

    // when
    await addObservers(
      mockServer,
      null,
      new EventService(),
      mockServer.mobService,
      mockServer.mobService.locationService,
      new StateService())

    // then
    expect(mockServer.addObserver).toBeCalled()
  })
})
