var MainPageModel = function () {

    this.setupHandlers();
    this.enable();

};
MainPageModel.prototype = {

    setupHandlers: function() {
        this.slideActivateHandler = this.slideActivate.bind(this);
        this.authInStartHandler = this.authInStart.bind(this);
        this.userDataErrorHandler = this.userDataError.bind(this);
        this.authInFinishedHandler = this.authInFinished.bind(this);
        this.signOutStartHandler = this.signOutStart.bind(this);
        this.signOutFinishedHandler = this.signOutFinish.bind(this);
        this.userHandler = this.user.bind(this);

    },


    enable: function () {

        radio.on('slider/slideActivate', this.slideActivateHandler);
        radio.on('auth/start', this.authInStartHandler);
        radio.on('userData/error', this.userDataErrorHandler);
        radio.on('auth/finished', this.authInFinishedHandler);
        radio.on('signOut/start', this.signOutStartHandler);
        radio.on('signOut/finished', this.signOutFinishedHandler);
        radio.on('auth/user', this.userHandler);


    },
    slideActivate: function(el) {
        radio.trigger("slider/showSlideByTab", el); // Показать соответствующий слайд, передаем активный таб
    },
    authInStart: function(area) {
        radio.trigger("auth/holdArea", [area, true]); // Параметры: слайдер, заморозить/разморозить

    },
    userDataError: function (info) {
        radio.trigger("slider/showMessage", info); // Высветить ошибку слайдера

    },
    authInFinished: function (area) {
        radio.trigger("auth/unHoldArea", [area, false]); // Параметры: слайдер, заморозить/разморозить
    },
    signOutStart: function (area) {
        radio.trigger("signOut/holdArea", [area, true]); // Параметры: слайдер, заморозить/разморозить
    },
    signOutFinish: function(area) {
        radio.trigger("signOut/unHoldArea", [area, false]); // Параметры: слайдер, заморозить/разморозить
    },
    user: function () {
        radio.trigger('auth/redirectToProfile', 'famtree.htm');

    }
};