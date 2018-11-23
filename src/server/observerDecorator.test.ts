import addObservers from "./observerDecorator"

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
    await addObservers(mockServer)

    // then
    expect(mockServer.addObserver).toBeCalled()
  })
})
