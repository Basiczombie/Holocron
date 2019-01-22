import $ from 'jquery'
import dragula from 'dragula'
import 'dragula_css'
import '../css/template.scss'
import 'milligram'

$(() => {
  // List of columns to watch.
  let containers = [
    document.querySelector('#students'),
    document.querySelector('#teacher-one'),
    document.querySelector('#teacher-two'),
    document.querySelector('#teacher-three')
  ]

  // Drag and Drop functionallity
  dragula({
    // Feeds the list of containers to dragula.
    containers: containers,
    // If not slotted into proper column delete the copy.
    removeOnSpill: true,
    // Copies one element from column into another column.
    copy: function (el, source) {
      return source === document.querySelector('#students')
    },
    // Prevents copied element from being added back to source.
    accepts: function (el, target) {
      return target !== document.querySelector('#students')
    },
    // Prevents the first element from being dragged.
    moves: function (el, source) {
      return !el.classList.contains('no-drag')
    }
  })

  // TODO build function to count and update count on header.
  containers.forEach(el => {
    let count = el.getElementsByTagName('*').length
  })
})
