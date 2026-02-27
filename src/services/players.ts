const urlPlayers = '/api/ea/rating/ea-sports-fc?locale=es';

function getPlayers() {
  return fetch(urlPlayers).then((response) => response.json());
}

export { getPlayers };
