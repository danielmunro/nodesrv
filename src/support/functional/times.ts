import Action from "../../action/action"
import {Request} from "../../request/request"

const defaultIterations = 1000

export default async function doNTimes(count: number, fn: () => any) {
  const results = []
  for (let i = 0; i < count; i++) {
    results.push(await fn())
  }

  return results
}

export async function doNTimesOrUntilTruthy(count: number, fn: () => any): Promise<any> {
  for (let i = 0; i < count; i++) {
    const result = await fn()
    if (result) {
      return result
    }
  }
}

export async function getSuccessfulAction(action: Action, request: Request) {
  return doNTimesOrUntilTruthy(defaultIterations, async () => {
    const handled = await action.handle(request)
    return handled.isSuccessful() ? handled : null
  })
}
