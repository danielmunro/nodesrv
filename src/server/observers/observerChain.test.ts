import { ObserverChain } from "./observerChain"

const mockObserver = jest.fn(() => ({
  notify: jest.fn(),
}))

describe("observerChain", () => {
  it("should call all observers", () => {
    const ob1 = mockObserver()
    const ob2 = mockObserver()

    expect(ob1.notify.mock.calls.length).toBe(0)
    expect(ob2.notify.mock.calls.length).toBe(0)

    new ObserverChain([ob1, ob2]).notify([])

    expect(ob1.notify.mock.calls.length).toBe(1)
    expect(ob2.notify.mock.calls.length).toBe(1)
  })
})
