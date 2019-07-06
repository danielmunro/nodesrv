import Response from "../../../request/response"

export default jest.fn(() => {
  let response: Response
  return {
    getResponse: () => response,
    sendResponseToRoom: (resp: Response) => {
      response = resp
    },
  }
})
