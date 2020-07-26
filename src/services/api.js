/**
 * Retrieve possible import from backend API
 */
export function getPossibleImport () {
  return fetch('/scripts/get_possible_import.php')
    .then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    })
    .catch((error) => {
      console.warn(error)
    })
}

/**
 * Trigger upload validation API after upload done for server side processing
 * @param {int} idVisit 
 * @param {int} timeStamp 
 * @param {int} totalFiles 
 * @param {string} originalOrthancStudyID 
 */
export function validateUpload (idVisit, timeStamp, totalFiles, originalOrthancStudyID) {
  const formData = new FormData()
  formData.append('id_visit', idVisit)
  formData.append('timeStamp', timeStamp)
  formData.append('totalDicomFiles', totalFiles)
  formData.append('originalOrthancStudyID', originalOrthancStudyID)

  return fetch('/scripts/validate_dicom_upload_tus.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formData

  }).then((answer) => {
    if (!answer.ok) { throw answer }
    return (answer.json())
  }).catch((error) => {
    console.warn(error)
  })
}

/**
 * Registering GaelO, only for dev purpose
 */
export function logIn () {
  const formData = new FormData()
  formData.append('username', process.env.REACT_APP_GAELO_LOGIN)
  formData.append('mdp', process.env.REACT_APP_GAELO_PASSWORD)
  formData.append('formSent', '1')

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


