import url from './httpUrl'

export const addNewClinic = async ({ data }) => {
  const response = await fetch(`${url}/clinics/addClinic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw Error('There was an issue while adding the clinic')
  }

  const newData = await response.json()
  return newData
}

export const getAllClinics = async () => {
  const res = await fetch(`${url}/clinics/getClinics`)
  if (!res.ok) {
    throw Error('There was an issue while fetching clinics')
  }

  const data = await res.json()
  return data
}

export const getClinicToEdit = async ({ id }) => {
  let res = await fetch(`${url}/clinics/getClinicToEdit?id=${id}`)
  if (!res.ok) {
    throw Error('There was an issue while fetching clinics')
  }

  const data = await res.json()
  return data
}

export const handleEditClinicLimit = async (data) => {
  const res = await fetch(`${url}/clinics/editClinicLimit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    throw Error('There was an issue while fetching clinics')
  }

  const newData = await res.json()
  return newData
}

export const handleDeleteDoctor = async (data) => {
  const res = await fetch(`${url}/clinics/deleteDoctor`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    throw Error('There was an issue while fetching clinics')
  }

  const newData = await res.json()
  return newData
}
