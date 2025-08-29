import url from './httpUrl'

export const addNewDoctor = async ({ clinic, docName }) => {
  const response = await fetch(`${url}/doctors/addNewDoc`, {
    method: 'Post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ clinic, docName })
  })
  if (!response.ok) {
    throw Error('There was a problem while adding doc')
  }

  const newDate = await response.json()
  return newDate
}

export const getAllDocs = async ({ signal, clinic }) => {
  let response
  if (clinic) {
    response = await fetch(`${url}/doctors/getDoctors?clinic=${clinic}`)
  }
  if (!response.ok) {
    throw Error('There was a problem with fetching doctors!!')
  }

  const data = await response.json()
  return data
}
