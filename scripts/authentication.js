window.addEventListener('load', function () {

    var webAuth = new auth0.WebAuth({
        domain: 'specifier.auth0.com',
        clientID: 'fvMtWEHx74JIig33pGXhi9nthQm2FyCq',
        responseType: 'token id_token',
        audience: 'https://specifier.auth0.com/userinfo',
        scope: 'openid',
        redirectUri: 'http://localhost:8080/upload',
        audience: 'http://www.specifierapp.com',
        scope: 'openid profile post:user-images'
    });

    var loginBtn = document.getElementById('btn-login');

    loginBtn.addEventListener('click', function (e) {
        e.preventDefault();

        if (!isAuthenticated()) {
            webAuth.authorize();
        }
        else {
            logout();
        }
    });

    var loginBtn = document.getElementById('btn-login');

    function handleAuthentication() {
        webAuth.parseHash(function (err, authResult) {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                setSession(authResult);
            } else if (err) {
                console.log(err);
                alert(
                    'Error: ' + err.error + '. Check the console for further details.'
                );
            }
            displayButtons();
        });
    }

    function setSession(authResult) {
        // Set the time that the Access Token will expire at
        var expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        );
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    function logout() {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        displayButtons();
    }

    function isAuthenticated() {
        // Check whether the current time is past the
        // Access Token's expiry time
        var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    function displayButtons() {
        if (isAuthenticated()) {
            loginBtn.innerText = "Log out";
        } else {
            loginBtn.innerText = "Log in";
        }
    }

    handleAuthentication();
});