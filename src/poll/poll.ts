import { Timer } from "../timer/timer"

export function poll(callback, time: Timer): void {
  setTimeout(() => {
    callback()
    poll(callback, time)
  }, time.getTimerLength())
}
