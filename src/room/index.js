// @flow

import Room from './model'

export const DIRECTIONS = {
  north: 'north',
  south: 'south',
  east: 'east',
  west: 'west',
  up: 'up',
  down: 'down',
}

export function directionsForRoom(room: Room) {
  return Object.keys(DIRECTIONS).filter(d => room[d])
}

/**
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
*/
