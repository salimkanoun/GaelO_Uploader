/**
 * Check if study does not already exist in backend
 */
export function isNewStudy (studyName, originalOrthancID) {

  return fetch('/api/studies/'+studyName+'/orthanc-study-id/'+originalOrthancID, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }

  }).then((answer) => {
    return true
    if (answer.status === 200 ) return false
    else if (answer.status === 404) return true
    else throw answer
  }).catch((error) => {
    throw error
  })
}


/**
 * Registering GaelO, only for dev purpose
 */
export function logIn () {

  let payload = {
    username : process.env.REACT_APP_GAELO_LOGIN,
    password : process.env.REACT_APP_GAELO_PASSWORD
  }

  return fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/json',
      Accept: 'text/json'
    },
    body: JSON.stringify(payload)

  })
    .then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer)
    })
    .catch((error) => {
      console.warn(error)
    })
}


