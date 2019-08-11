import { Timer } from "../timer/timer"

export function poll(callback: any, time: Timer): void {
  setTimeout(() => {
    callback()
    poll(callback, time)
  }, time.getTimerLength())
}
