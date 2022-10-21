

function findFlags(fields) {
    fetch(`/api/flag?freetId=${fields.id}`)
      .then(showResponse)
      .catch(showResponse);
}
function addFlag(fields) {
    fetch(`/api/flag?freetId=${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}}) 
      .then(showResponse)
      .catch(showResponse);
}

function deleteFlag(fields) {
    fetch(`/api/flag?freetId=${fields.id}`, {method: 'DELETE'}) 
      .then(showResponse)
      .catch(showResponse);
}