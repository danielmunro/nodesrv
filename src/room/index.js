import slugify from 'slugify'
import sillyname from 'sillyname'

export function generateName () {
  return slugify(sillyname(), {
    lower: true
  })
}

export function allDirections () {
  return ['north', 'south', 'east', 'west', 'up', 'down']
}

function reverseDirection (direction) {
  switch (direction) {
    case 'north':
      return 'south'
    case 'south':
      return 'north'
    case 'east':
      return 'west'
    case 'west':
      return 'east'
    case 'up':
      return 'down'
    case 'down':
      return 'up'
  }
}
