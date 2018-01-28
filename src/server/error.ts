const CONNECTION_RESET = 'Error: read ECONNRESET'

function isInterestingError(error: Error): boolean {
  return error.toString() !== CONNECTION_RESET
}

function onError(error: Error): void {
  if (isInterestingError(error)) {
    console.log('error event', error)
  }
}

export default onError
