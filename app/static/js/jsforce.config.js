if (!jsfConn) {
    jsforce.browser.init({
        clientId: '',
        redirectUri: 'http://localhost:3000/',
        proxyUrl: 'http://localhost:3123/proxy/'
    });
    var jsfConn = jsforce.browser.connection;

    // アクセストークンがない場合は、認証
    if (!jsfConn.accessToken) {
        jsforce.browser.login();
    }
}