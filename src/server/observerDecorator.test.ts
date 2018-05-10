import addObservers from "./observerDecorator"

describe("observer decorator", () => {
  it("should call addObserver on server", () => {
    // setup
    const mock = jest.fn(() => ({
      addObserver: jest.fn(),
    }))
    const mockServer = mock()

    // when
    addObservers(mockServer)

    // then
    expect(mockServer.addObserver).toBeCalled()
  })
})
