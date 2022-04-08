import { scores } from '../styles/global'

/**
 * Reusable code
 * getColorFromScore is called both on Home.js and ProductModal.js
 */

export const getColorFromScore = (score) => {
  switch (score) {
    case ('a'):
      return scores.green
    case ('b'):
      return scores.lightgreen
    case ('c'):
      return scores.yellow
    case ('d'):
      return scores.orange
    case ('e'):
      return scores.red
    default:
      return 'grey'
  }
}

export const getColorFromLevel = (level) => {
  switch (level) {
    case ('low'):
      return scores.green
    case ('moderate'):
      return scores.yellow
    case ('high'):
      return scores.red
    default:
      return 'grey'
  }
}