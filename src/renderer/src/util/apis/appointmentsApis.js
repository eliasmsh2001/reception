import url from './httpUrl'

export const addNewAppointment = async (data) => {
  const response = await fetch(`${url}/appointments/addNewAppointment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    if (response.status === 405) {
      throw Error('تم الوصول الى الحد الأقصة من الأرقام لهذه العيادة')
    } else if (response.status === 406) {
      throw Error('الرجاء التأكد من صحة البيانات')
    }
  }

  const newData = response.json()
  return newData
}

export const getAllAppointments = async () => {
  const response = await fetch(`${url}/appointments/getAppointments`)

  if (!response.ok) {
    throw Error('There was an issur while fetching Appointments')
  }

  const data = await response.json()
  return data
}

export const deleteAppointment = async ({ id }) => {
  const response = await fetch(`${url}/appointments/deleteAppointment`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ appointmentId: id })
  })

  if (!response.ok) {
    throw Error('There was an Issue while adding appointment!')
  }

  const newData = response.json()
  return newData
}

export const getAllArchivedAppointments = async ({
  signal,
  year,
  month,
  day,
  searchTerm,
  chosenClinic,
  currentPeriod,
  chosenArea,
  selectedUser
}) => {
  const response = await fetch(
    `${url}/appointments/getArchivedAppointments?year=${year}&month=${month}&searchTerm=${searchTerm}&chosenClinic=${chosenClinic}&day=${day}&currentPeriod=${currentPeriod}&chosenArea=${chosenArea}&selectedUser=${selectedUser}`
  )

  if (!response.ok) {
    throw Error('There was an issur while fetching Appointments')
  }

  const data = await response.json()
  return data
}

export const getAllArea = async ({ area }) => {
  let response
  if (area) {
    response = await fetch(`${url}/appointments/areas?area=${area}`)
  }
  if (!response.ok) {
    throw Error('There was an issue while fetching areas!!s')
  }

  const data = response.json()
  return data
}

export const getEveryArea = async ({ area }) => {
  const response = await fetch(`${url}/appointments/allAreas`)
  if (!response.ok) {
    throw Error('There was an issue while fetching areas!!s')
  }

  const data = response.json()
  return data
}

export const deleteArea = async (data) => {
  const response = await fetch(`${url}/appointments/deleteArea`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw Error('There was an Issue while adding appointment!')
  }

  const newData = response.json()
  return newData
}
export const editArea = async (data) => {
  const response = await fetch(`${url}/appointments/editArea`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw Error('There was an Issue while adding appointment!')
  }

  const newData = response.json()
  return newData
}

export const editArchivedAppointment = async (data) => {
  const response = await fetch(`${url}/appointments/archivedAppointmentToEdit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw Error('There was an Issue while adding appointment!')
  }

  const newData = response.json()
  return newData
}
