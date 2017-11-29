const clientId = "46fa3db971054808b14b577c79a71c07";
//const secret = "e72502de443847fd9eaa3c2d7a71adce";
const redirectURI = "http://localhost:3000/";
const spotifyRedirectUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
let accessToken;


export let Spotify = {
  getAccessToken() {
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

  savePlaylist(playlist, trackURIs) {
    if (!playlist && !trackURIs) {
      return;
    }
    let token = Spotify.getAccessToken();
    let headers = {Authorization: `Bearer ${token}`};
    let userID;
    let playlistID;
    fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
      return response.json();
    }).then(jsonResponse => {
      userID = jsonResponse.id;
      console.log(userID); //for debugging purposes
      return userID;
    }).then(userID => {
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({name: playlist})
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        playlistID = jsonResponse.id;
        console.log("userID is: " + userID); //for debugging purposes
        console.log("playlistID is: " + playlistID); //for debugging purposes
        return playlistID;
      }).then(playlistID => {
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({uris: trackURIs})
        })
      })
    });
  },

  //   fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     },
  //     method: 'POST',
  //     body: JSON.stringify({
  //       name: playlist,
  //       public: false
  //     })
  //   }).then(response => {
  //     return response.json();
  //   }).then(jsonResponse => {
  //     playlistID = jsonResponse.id;
  //     return playlistID;
  //   });
  //   fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     },
  //     method: 'POST',
  //     body: JSON.stringify({uris: trackURIs})
  //   }).then(response => {
  //     return response.json();
  //   }).then(jsonResponse => {jsonResponse}); //not sure about this spot
  // },

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
