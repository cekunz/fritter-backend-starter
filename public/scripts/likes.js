

function viewLikesByFreet(fields) {
    fetch(`/api/likes?freetId=${fields.id}`)
      .then(showResponse)
      .catch(showResponse);
}

function sendLike(fields) {
    fetch(`/api/likes/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function deleteLike(fields) { 
    fetch(`/api/likes/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}