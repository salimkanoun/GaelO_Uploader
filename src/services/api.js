
export function getAets () {
  return fetch('/scripts/get_possible_import.php')
    .then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    })
    .catch((error) => {
      console.warn(error)
    })
}

export function logIn () {
  const formData = new FormData()
  formData.append('username', 'administrator')
  formData.append('mdp', 'Salim1985')
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
      return (answer.json())
    })
    .catch((error) => {
      console.warn(error)
    })
}

export function registerStudy () {
  const formData = new FormData()
  formData.append('etude', 'GATA')
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
      return (answer.json())
    })
    .catch((error) => {
      console.warn(error)
    })
}

export function validateUpload(idVisit, timeStamp, totalFiles, originalOrthancStudyID){

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
