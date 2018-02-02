export default function roll(hit, dam) {
  let roll = 0
  while (hit > 0) {
    roll += getRandomInt(dam)
    hit--
  }

  return roll
}

function getRandomInt(max) {
  return 1 + Math.floor(Math.random() * Math.floor(max - 1))
}