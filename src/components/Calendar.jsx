import React, { useEffect, useState } from 'react'
import '../components/calendar-style.css'

const Calendar = () => {
  const currentDay = new Date().getDate()
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const [optionSelect, setOptionSelect] = useState(currentMonth)
  const [month, setMonth] = useState(optionSelect)
  const [year, setYear] = useState(currentYear)
  const [day, setDay] = useState(currentDay)
  const [daysInMonth, setDaysInMonth] = useState(0)

  const [daysArray, setDaysArray] = useState([])
  const dayNamesArray = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const getMonth = (monthNumber) => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    setMonth(months[monthNumber - 1])
  }

  const getDaysOfMonth = (year, month) => {
    const lastDayOfMonth = new Date(year, month, 0).getDate()
    const daysArray = Array.from({ length: lastDayOfMonth }, (_, index) => index + 1)

    setDaysArray(daysArray)
    setDaysInMonth(daysInMonth)
  }

  const handleChangeMonth = (event) => {
    const month = event.target.value
    setOptionSelect(month)
    setDaysArray([])
  }

  const handleChangeDay = (event) => {
    const day = event.target.value
    setDay(day)
  }

  const handleChangeYear = (event) => {
    const year = event.target.value
    setYear(year)
  }

  useEffect(() => {
    getMonth(optionSelect)
    getDaysOfMonth(year, optionSelect)
  }, [optionSelect])

  const firstDayOfMonth = new Date(year, optionSelect - 1, 1).getDay()

  return (
    <div className='dropdown'>
      <button className='form-select ' type='button' data-bs-toggle='dropdown'>
        {`${day} ${month} ${year}`}
      </button>
      <div className='dropdown-menu'>
        <div className='calendar'>
          <div className='input-group mb-3'>
            <input className='form-control' type='number' onChange={handleChangeDay} placeholder='Dia' value={day} />
            <select className='form-select' name='month' id='month' onChange={handleChangeMonth} value={optionSelect}>
              <option value='1'>Enero</option>
              <option value='2'>Febrero</option>
              <option value='3'>Marzo</option>
              <option value='4'>Abril</option>
              <option value='5'>Mayo</option>
              <option value='6'>Junio</option>
              <option value='7'>Julio</option>
              <option value='8'>Agosto</option>
              <option value='9'>Septiembre</option>
              <option value='10'>Octubre</option>
              <option value='11'>Noviembre</option>
              <option value='12'>Diciembre</option>
            </select>
            <input className='form-control' type='number' onChange={handleChangeYear} placeholder='Año' value={year} />
          </div>
          <div>
            <ol>
              {dayNamesArray.map((el, index) => (
                <li className='day-name' key={index}>{el}</li>
              ))}
            </ol>
            <ol>
              {
                Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <li key={`empty-${index}`} />
                ))
              }
              {daysArray.map((day, index) => (
                <li key={index}>{day}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Calendar
