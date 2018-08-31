/* global Keycloak, console */

var app = app || {};
app.keycloak = Keycloak();
app.keycloak.init({
  onLoad: 'check-sso'
}).then(function(authenticated) {
  // location of ArkaneConnect => local || tst1 || staging || prod
  app.initApp(authenticated, app.keycloak);
}).catch(function(e) {
  console.log(e);
});
