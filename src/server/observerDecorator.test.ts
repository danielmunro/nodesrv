import EventService from "../event/eventService"
import {getConnection, initializeConnection} from "../support/db/connection"
import addObservers from "./observerDecorator"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("observer decorator", () => {
  it("should call addObserver on server", async () => {
    // setup
    const mobTable = {
      getMobs: [],
      getWanderingMobs: jest.fn(),
    }
    const mock = jest.fn(() => ({
      addObserver: jest.fn(),
      getMobTable: () => mobTable,
      mobService: {
        locationService: {
          getMobLocationCount: jest.fn(),
        },
        pruneDeadMobs: () => [],
      },
      resetService: {
        mobResets: [],
      },
      service: {
        mobTable,
      },
    }))
    const mockServer = mock()

    // when
    await addObservers(mockServer.service, mockServer, null, new EventService())

    // then
    expect(mockServer.addObserver).toBeCalled()
  })
})
