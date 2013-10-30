
window.fbAsyncInit = function() {
  FB.init({
        appId      : '252390838242679',                        // App ID from the app dashboard                            // Check Facebook Login status
        status: true,
        cookie: true,
        channelUrl : '//bajarmusica.me/channel.html',
        xfbml      : true                                  // Look for social plugins on the page
      });
};

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/es_LA/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));