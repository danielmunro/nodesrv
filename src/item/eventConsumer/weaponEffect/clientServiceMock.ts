import Response from "../../../request/response"

export default jest.fn(() => {
  const responses: Response[] = []
  return {
    getFirstResponse: () => responses[0],
    getResponse: () => responses[responses.length - 1],
    sendResponseToRoom: (resp: Response) => {
      responses.push(resp)
    },
  }
})
