import match from "./match"

type Matcher = (thing: any) => boolean

export default function(things: any, search: string, matcher?: Matcher) {
  let amount = 0
  let searching = search
  if (hasCounter(search)) {
    amount = getCounterAmount(search) - 1
    searching = getSearchMinusCounter(search)
  }
  const matchFn = matcher ? matcher : (thing: any) => thing
  for (const thing of things) {
    if (matchFn(thing) && match(String(thing), searching)) {
      if (amount === 0) {
        return thing
      }
      amount--
    }
  }
  return false
}

function getSearchMinusCounter(search: string) {
  const parts = search.split(".")
  return parts[1]
}

function getCounterAmount(search: string) {
  const parts = search.split(".")
  return +parts[0]
}

function hasCounter(search: string): boolean {
  return search.indexOf(".") > -1
}
