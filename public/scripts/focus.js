
function getFocus() {
    fetch(`/api/focus`) 
      .then(showResponse)
      .catch(showResponse);
}

function createFocus(fields) {
    fetch(`/api/focus?name=${fields.name}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}}) 
      .then(showResponse)
      .catch(showResponse);
}

function deleteFocus(fields) {
    fetch(`/api/focus?name=${fields.name}`, {method: 'DELETE'}) 
      .then(showResponse)
      .catch(showResponse);
}