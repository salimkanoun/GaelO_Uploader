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
