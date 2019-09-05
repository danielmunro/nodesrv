const mockWebSocket = jest.fn(() => ({
  close: jest.fn(),
  onmessage: jest.fn(),
  send: jest.fn(),
}))

export default function(): WebSocket {
  return mockWebSocket() as any
}
