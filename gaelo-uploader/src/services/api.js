

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

export function logIn(){

    let formData = new FormData();
    formData.append('username', 'administrator');
    formData.append('mdp', 'Emiliedu31');
    formData.append('formSent', '1');


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

export function registerStudy(){

    let formData = new FormData();
    formData.append('etude', 'test');
    formData.append('role', 'Investigator');


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
