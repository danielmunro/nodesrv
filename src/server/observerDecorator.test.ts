import EventService from "../event/eventService"
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
        getTimeService: jest.fn(),
        getWeatherService: jest.fn(),
      },
    }))
    const mockServer = mock()

    // when
    await addObservers(mockServer.service, mockServer, null, new EventService(), mockServer.mobService)

    // then
    expect(mockServer.addObserver).toBeCalled()
  })
})
