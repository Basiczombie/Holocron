import $ from 'jquery'
import dragula from 'dragula'
import 'dragula_css'
import '../css/template.scss'
import 'milligram'
import fetch from 'isomorphic-fetch'
import decode from 'he'

$(() => {
  function htmlDecodeToJson (resp) {
    return resp.text().then(resp => decode(resp)).then(resp => JSON.parse(resp))
  }

  let path = {
    'students': 'public/json/students.json',
    'teachers': 'public/json/teachers.json'
  }

  // Read Json Files
  let students = fetch(path.students)
    .then(htmlDecodeToJson)
  let teachers = fetch(path.teachers)
    .then(htmlDecodeToJson)

  console.log(students)

  // List of columns to watch.
  let containers = [
    document.querySelector('#students'),
    document.querySelector('#teacher-one'),
    document.querySelector('#teacher-two'),
    document.querySelector('#teacher-three')
  ]

  // Drag and Drop functionallity
  let drake = dragula({
    // Feeds the list of containers to dragula.
    containers: containers,
    // If not slotted into proper container restore to current container.
    revertOnSpill: true,
    // Prevents the first element from being dragged.
    moves: function (el, source) {
      return !el.classList.contains('no-drag')
    }
  })

  refreshCounts()

  // Counts total children in parent element and returns count.
  drake.on('drop', (el, target, source, sibling) => {
    refreshCounts()
  })

  function refreshCounts () {
    containers.forEach(el => {
      let count = el.querySelectorAll('.student').length
      let elHeader = el.querySelector('.count')
      elHeader.textContent = `(${count})`
    })
  }
})
