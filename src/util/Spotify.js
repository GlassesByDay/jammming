const clientId = "46fa3db971054808b14b577c79a71c07";
//const secret = "e72502de443847fd9eaa3c2d7a71adce";
const redirectURI = "http://localhost:3000/";
const spotifyRedirectUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
let accessToken;


export let Spotify = {
  getAccessToken() {
    console.log(`getAccessToken called... accessToken value is ${accessToken}`);
    if (accessToken) {
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location.href = spotifyRedirectUrl;
    }
  },

  //NOTE: have I called .getAccessToken in the right place here?
  search(term) {
    Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks.items) {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          };
        });
      }
    })
  }


};
