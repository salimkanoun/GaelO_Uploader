/**
 * Check if study does not already exist in backend
 */
export function isNewStudy (originalOrthancID) {
  const formData = new FormData()
  formData.append('originalOrthancID', originalOrthancID)

  return fetch('/scripts/is_new_study.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formData

  }).then((answer) => {
    if (!answer.ok) { throw answer }
    return (answer.json())
  }).catch((error) => {
    throw error
  })
}


/**
 * Registering GaelO, only for dev purpose
 */
export function logIn () {
  const formData = new FormData()
  formData.append('username', process.env.REACT_APP_GAELO_LOGIN)
  formData.append('mdp', process.env.REACT_APP_GAELO_PASSWORD)
  formData.append('formSent', process.env.REACT_APP_GAELO_VISITID)

  return fetch('/index.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formData

  })
    .then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer)
    })
    .catch((error) => {
      console.warn(error)
    })
}

/**
 * Registering a study only for dev
 */
export function registerStudy () {
  const formData = new FormData()
  formData.append('etude', process.env.REACT_APP_GAELO_STUDY)
  formData.append('role', 'Investigator')

  return fetch('/root_investigator', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formData

  })
    .then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer)
    })
    .catch((error) => {
      console.warn(error)
    })
}
