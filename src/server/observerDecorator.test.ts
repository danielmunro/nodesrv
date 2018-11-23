import addObservers from "./observerDecorator"

describe("observer decorator", () => {
  it("should call addObserver on server", async () => {
    // setup
    const mock = jest.fn(() => ({
      addObserver: jest.fn(),
      locationService: {
        getMobLocationCount: jest.fn(),
      },
      resetService: {
        mobResets: [],
      },
      service: {
        mobTable: {
          getMobs: [],
          getWanderingMobs: jest.fn(),
        },
      },
    }))
    const mockServer = mock()

    // when
    await addObservers(mockServer)

    // then
    expect(mockServer.addObserver).toBeCalled()
  })
})
