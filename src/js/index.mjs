import $ from 'jquery'
import 'dragula_css'
import '../css/template.scss'
import 'milligram'
import dragula from 'dragula'
import students from '../public/json/students.json'
import teachers from '../public/json/teachers.json'
// import fetch from 'isomorphic-fetch'
// import decode from 'he'

$(() => {
  // function htmlDecodeToJson (resp) {
  //   return resp.text().then(resp => decode(resp)).then(resp => JSON.parse(resp))
  // }

  // // Read Json Files
  // let studentList = fetch(students)
  //   .then(htmlDecodeToJson)
  // let teacherList = fetch(teachers)
  //   .then(htmlDecodeToJson)

  // List of containers to watch.
  let containers = [
    document.querySelector('#students')
  ]

  // Dynamically set Teachers.
  let main = document.querySelector('.index')
  let teacherList = Object.entries(teachers)
  teacherList.forEach(([key, value]) => {
    let teacherNumber = `teacher-${key}`
    let teacherTemplate = `
      <div id="${teacherNumber}" class="column container">
        <h4 class="no-drag">${value.name}<span class="count"></span></h4>
      </div>
    `
    main.insertAdjacentHTML('beforeend', `${teacherTemplate}`)
    containers.push(document.querySelector(`#${teacherNumber}`))
  })

  // Dynamically set Students.
  let studentColumn = document.querySelector('#students')
  let studentList = Object.entries(students)
  studentList.forEach(([key, value]) => {
    let studentTemplate = `
      <div id="${value.dcid}" class="student">
        <blockquote>
          ${value.firstlast}<br>
          Gender:<span> ${value.gender}</span>
        </blockquote>
      </div>
    `
    studentColumn.insertAdjacentHTML('beforeend', `${studentTemplate}`)
  })

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

  // Counts total children in parent element and returns count.
  refreshCounts()
  drake.on('drop', (el, target, source, sibling) => {
    refreshCounts()
  })

  function refreshCounts () {
    containers.forEach(el => {
      let count = el.querySelectorAll('.student').length
      let elHeader = el.querySelector('.count')
      elHeader.textContent = ` (${count})`
    })
  }
})
