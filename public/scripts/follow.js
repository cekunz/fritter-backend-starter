


function viewFollowersbyUser(fields) {
    fetch(`/api/follow/followers?userId=${fields.id}`) 
      .then(showResponse)
      .catch(showResponse);
}

function viewFollowingbyUser(fields) {
    fetch(`/api/follow/following?userId=${fields.id}`) 
      .then(showResponse)
      .catch(showResponse);
}

function followUser(fields) {
    fetch(`/api/follow?userId=${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}}) 
      .then(showResponse)
      .catch(showResponse);
}

function unfollowUser(fields) {
    fetch(`/api/follow?userId=${fields.id}`, {method: 'DELETE'}) 
      .then(showResponse)
      .catch(showResponse);
}