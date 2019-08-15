import Response from "../../../messageExchange/response"

export default jest.fn(() => {
  const responses: Response[] = []
  return {
    getFirstResponse: () => responses[0],
    getResponse: () => responses[responses.length - 1],
    getResponses: () => responses,
    sendResponseToRoom: (resp: Response) => {
      responses.push(resp)
    },
  }
})
