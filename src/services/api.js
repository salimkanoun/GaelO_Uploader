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
export function validateUpload (idVisit, timeStamp, sucessIDsUploaded, totalFiles, originalOrthancStudyID) {
  const formData = new FormData()
  formData.append('id_visit', idVisit)
  formData.append('timeStamp', timeStamp)
  formData.append('totalDicomFiles', totalFiles)
  formData.append('originalOrthancStudyID', originalOrthancStudyID)
  formData.append('sucessIDsUploaded', JSON.stringify(sucessIDsUploaded))

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


