/* global Keycloak, console */

var keycloak = Keycloak();
keycloak.init({
  onLoad: 'check-sso'
}).then(function(authenticated) {
  document.body.classList.add(authenticated ? 'logged-in' : 'not-logged-in');
  document.getElementById('keycloak-username').innerText = keycloak.subject + ' - ' + keycloak.token + ' - ';
  document.getElementById('keycloak-loginlink').addEventListener('click', function(e) {
    e.preventDefault();
    keycloak.login({redirectUri: ''});
  });
  document.getElementById('keycloak-logout').addEventListener('click', function(e) {
    e.preventDefault();
    keycloak.logout();
  });
}).catch(function(e) {
  console.log(e);
});
