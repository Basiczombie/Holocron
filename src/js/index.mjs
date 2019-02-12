import $ from 'jquery'
import 'dragula_css'
import 'tingle_css'
import '../css/template.scss'
import 'milligram'
import 'whatwg-fetch'
import tingle from 'tingle.js'
import dragula from 'dragula'
import _ from 'lodash/array'
import students from '../public/json/students.json'
import teachers from '../public/json/teachers.json'

$(() => {
  // Required element variables
  let teachersElm = document.querySelector('#teachers')
  let studentElm = document.querySelector('#students')
  let btnGroup = document.querySelector('#btn-group')
  const gradeLevel = [0, 1, 2, 3, 4, 5, 6, 'multi']

  // Data from PS
  let studentFetch = students
  let teacherFetch = teachers

  // List of containers to watch.
  let containers = [
    document.querySelector('#students')
  ]
  const teacherBuildList = () => {
    if (!sessionStorage.getItem('teacherEntry')) {
      return []
    } else {
      return JSON.parse(sessionStorage.getItem('teacherEntry'))
    }
  }
  let teacherEntry = teacherBuildList()

  const studentBuildList = (array) => {
    if (!sessionStorage.getItem('studentEntry')) {
      return array
    } else {
      return JSON.parse(sessionStorage.getItem('studentEntry'))
    }
  }
  let studentEntry = studentBuildList(...students)
  console.log(studentEntry)

  // Modal configuration and html injection
  let modal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overly', 'button', 'escape'],
    closeLabel: 'Close'
  })

  modal.setContent(`
    <h3>Add Teacher</h3>
    <form id="teacher-form" action="" method="POST">
      <div class="row">
        <div class="column">
            <label for="teacher-title">Title:</label> 
        </div>
        <div class="column">
            <select id="teacher-title">
              <option value="Mrs">Mrs.</option>
              <option value="Mr">Mr.</option>
              <option value="Miss">Miss</option>
              <option value="Ms">Ms.</option>
              <option value="Dr">Dr.</option>
            </select>
        </div>
      </div>
      <div class="row">
        <div class="column">
            <label for="teacher-name">Teacher Last Name:</label>
        </div>
        <div class="column">
            <input type="text" id="teacher-name">
        </div>
      </div>
      <div class="row">
        <div class="column">
            <label for="teacher-grade">Grade Level:</label> 
        </div>
        <div class="column">
            <select id="teacher-grade">
              <option value="0">K</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">multi</option>
            </select>
        </div>
      </div>
    </form> 
  `)
  modal.setFooterContent(`
    <div class="row">
      <div class="column">
        <button id="btn-cancel" class="button button-cancel">Cancel</button>
        <button id="btn-confirm" class="button">Confirm</button>
      </div>
    </div>
  `)

  // EventListeners for Modal buttons
  document.getElementById('modal').addEventListener('click', function () {
    modal.open()
  })
  document.getElementById('btn-cancel').addEventListener('click', function () {
    modal.close()
  })
  document.getElementById('btn-confirm').addEventListener('click', function () {
    let teacherTitle = document.getElementById('teacher-title').value
    let teacherName = document.getElementById('teacher-name').value
    let teacherGrade = document.getElementById('teacher-grade').value
    let teacher = `${teacherTitle}. ${teacherName}`
    modal.close()
    document.getElementById('teacher-form').reset()
    teacherProcess(teacher, teacherGrade)
  })

  // Generate grade selection btn-group
  gradeLevel.forEach((element) => {
    let grade = element
    if (parseInt(element) === 0) {
      grade = 'K'
    }
    let btnGroupTemplate = `
      <div class="column">
        <button class="button button-black button-outline btn-group-item" id="button-${element}">${grade}</button>
      </div>
    `
    btnGroup.insertAdjacentHTML('beforeend', `${btnGroupTemplate}`)
  })

  // Clear the given elements innerHtml
  const clear = (elem) => {
    while (elem.firstChild) {
      elem.removeChild(teachersElm.firstChild)
    }
  }

  // Dynamically set Students.
  const studentProcess = () => {
    let studentList = Object.entries(studentFetch)
    studentList.forEach(([key, value]) => {
      let gender
      if (value.gender.toLowerCase() === 'male') {
        gender = 'blue'
      } else if (value.gender.toLowerCase() === 'female') {
        gender = 'pink'
      } else {
        gender = 'orange'
      }
      let studentTemplate = `
        <div id="${value.dcid}" class="student">
          <blockquote class="${gender}">
            ${value.firstlast}<br>
            Gender: ${value.gender}
          </blockquote>
        </div>
      `
      studentElm.insertAdjacentHTML('beforeend', `${studentTemplate}`)
    })
    sessionStorage.setItem('studentEntry', JSON.stringify(studentEntry))
  }

  studentProcess()

  // Dynamically set Teachers.
  const teacherProcess = (name, grade) => {
    let teacher = {
      'name': name,
      'grade_level': grade,
      'students': []
    }
    teacherEntry.push(teacher)
    sessionStorage.setItem('teacherEntry', JSON.stringify(teacherEntry))
    clear(teachersElm)
    teacherRender()
  }

  const teacherRender = () => {
    let teacherList = Object.entries(teacherEntry)
    let count = 0
    let rowCount = 0
    teacherList.forEach(([key, value]) => {
      if (count % 3 === 0) {
        rowCount++
        let rowTemplate = `
          <div class="row row-style" id="teacher-row-${rowCount}"></div>
        `
        teachersElm.insertAdjacentHTML('beforeend', `${rowTemplate}`)
      }
      let rowInsert = document.querySelector(`#teacher-row-${rowCount}`)
      let teacherNumber = `teacher-${key}`
      let teacherTemplate = `
        <div id="${teacherNumber}" class="column drake-container" data-grade="${value.grade_level}">
          <h4 class="no-drag">${value.name}<span class="count"></span>
        </div>
      `
      rowInsert.insertAdjacentHTML('beforeend', `${teacherTemplate}`)
      containers.push(document.querySelector(`#${teacherNumber}`))
      count++
    })
  }

  teacherRender()

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
    let student = buildStudent(el)
    let teacherTarget = buildTeacher(target)
    let teacherSource = buildTeacher(source)
    let teacherList = Object.entries(teacherEntry)
    teacherList.forEach(([key, value]) => {
      if (value.name === teacherSource.name && value.grade_level === teacherSource.grade_level) {
        let teacherStudents = value.students
        _.remove(teacherStudents, function (item) {
          return item.dcid === student.dcid
        })
      }
      if (value.name === teacherTarget.name && value.grade_level === teacherTarget.grade_level) {
        value.students.push(student)
      }
    })
    sessionStorage.setItem('teacherEntry', JSON.stringify(teacherEntry))
  })

  function buildTeacher (el) {
    let elem = el.cloneNode(true)
    let elemContent = elem.innerHTML = elem.innerText || elem.textContent
    let innerContentArray = elemContent.replace(/(\r\n|\n|\r)/gm, ' ').trim().split(' ').filter(Boolean)
    let teacher = {
      'name': `${innerContentArray[0]} ${innerContentArray[1]}`,
      'grade_level': elem.getAttribute('data-grade')
    }
    return teacher
  }

  function buildStudent (el) {
    let elem = el.cloneNode(true)
    let elemContent = elem.innerHTML = elem.innerText || elem.textContent
    let innerContentArray = elemContent.replace(/(\r\n|\n|\r)/gm, ' ').trim().split(' ').filter(Boolean)
    let lastFirst = `${innerContentArray[0]} ${innerContentArray[1]}`
    let gender = `${innerContentArray[3]}`
    let student = {
      'lastfirst': lastFirst,
      'gender': gender,
      'dcid': el.getAttribute('id')
    }
    return student
  }

  function refreshCounts () {
    containers.forEach(el => {
      let count = el.querySelectorAll('.student').length
      let elHeader = el.querySelector('.count')
      elHeader.textContent = ` (${count})`
    })
  }
  // Get student information from a selected element
  // let matches = studentElm.querySelectorAll('.student')
  // matches.forEach(item => {
  //   let student = item.innerHTML = item.innerText || item.textContent
  // })
})
