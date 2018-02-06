export const environment = {
  production: true,
  apiDomain: '/',
  auth0Config: {
		clientID: '20q4K0qOtDnSdZImAk8mdJgVz64nSDvr',
		domain: 'spotify-playlists.auth0.com',
		responseType: 'token id_token',
		audience: 'https://spotify-playlists.auth0.com/userinfo',
		redirectUri: 'http://localhost:4200/callback/',
		scope: 'openid email profile'
  }
};
