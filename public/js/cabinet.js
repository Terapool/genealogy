window.onload = function () {
    setSignOutHandler();
    var loadUserTimer = setInterval(prepareUserSettings, 500);
    function prepareUserSettings () {
        var user = firebase.auth().currentUser;
        if (user){
            var headerUser = document.getElementById("cabinet-header-user");
            var preloader = document.getElementById("cabinet-header-preloader");
            preloader.style.display="none";
            headerUser.innerHTML = user.email;
            clearInterval(loadUserTimer);
        }
    }
    function setSignOutHandler() {
        var signOutButton = document.getElementById("cabinet-header-exit");
        signOutButton.onclick = signOutHandler;
    }
    function signOutHandler(obj) {
        if (obj.target.id === "cabinet-header-exit") {
            if (firebase.auth().currentUser) {
                // [START signout]
                console.log(firebase.auth().currentUser);
                firebase.auth().signOut();
                // [END signout]
            } else {
                alert("В этом кабинете нет пользователей.");
            }
            window.location = "index.htm";
        }
    }
};


