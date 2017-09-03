var MainPageController = function () {
    this.view = new MainPageView();
    this.model = new MainPageModel();
    this.model.view = this.view;
    this.init();
};

MainPageController.prototype = {
    init: function () {
        this.firebaseCatchUser();
        this.setupHandlers()
            .enable();
    },
    firebaseCatchUser: function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                radio.trigger('auth/user');
            }
        });

    },
    setupHandlers: function () {
        this.sliderRotateHandler = this.sliderRotate.bind(this);
        this.signInHandler = this.signIn.bind(this);
        this.signOutHandler = this.signOut.bind(this);
        return this;
    },

    enable: function () {
        radio.on('slider/tabClick', this.sliderRotateHandler);
        radio.on('auth/authInButtonClick', this.signInHandler);
        radio.on('signOut/signOutButtonClick', this.signOutHandler);
        return this;
    },
    sliderRotate: function (el) {
        radio.trigger('slider/slideActivate', el);

    },
    signIn: function (data) {
        radio.trigger('userData/error', ['authInMessage','No Error']);
        radio.trigger('auth/start', 'slider1'); // In common sense slider1 to be changed to some |authIn area|
        var email = data[0];
        var password = data[1];

        if (email.length < 4) {
            radio.trigger('userData/error', ['authInMessage','No Email']);
            radio.trigger('auth/finished', 'slider1');
            return;
        }
        if (password.length < 4) {
            radio.trigger('userData/error', ['authInMessage','No Password']);
            radio.trigger('auth/finished', 'slider1');
            return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
           var errorMessage = error.message;
            // [START_EXCLUDE]
            radio.trigger('userData/error', ['authInMessage',error.code, error.message]);
            // [END_EXCLUDE]
        });
        radio.trigger('auth/finished', 'slider1');
    },
    signOut: function (data) {
        radio.trigger('userData/error', ['SignOutMessage','Start registration']);
        radio.trigger('signOut/start', 'slider2'); // In common sense slider2 to be changed to some |signOut area|
        var email = data[0];
        var password = data[1];
        var password2 = data[2];
        if (password !== password2) {
            radio.trigger('userData/error', ['signOutMessage','Wrong passport repeat']);
            radio.trigger('signOut/finished', 'slider2');
            return;
        }
        if (email.length < 4) {
            radio.trigger('userData/error', ['signOutMessage','No Email']);
            radio.trigger('signOut/finished', 'slider2');
            return;
        }
        if (password.length < 4) {
            radio.trigger('userData/error', ['signOutMessage','No Password']);
            radio.trigger('signOut/finished', 'slider2');
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            radio.trigger('userData/error', ['signOutMessage',error.code, error.message]);
            console.log(error);
            // [END_EXCLUDE]
        });
        radio.trigger('signOut/finished', 'slider2');
    }


};