var MainPageView = function () {
    this.tabs = ["slider1-tab", "slider2-tab", "slider3-tab"];//Указываем  id табов (верхнего меню слайдов). "Вход на сайт", "Регистрация", "О проекте"
    this.slides = ["slider1", "slider2", "slider3"];// Указываем id слайдов, массив такой же длины
    //For DOM Elements
    this.inputEmail = "email";
    this.inputPassword = "password";
    this.signInButton ="sign-in-button";
    this.signInAreaMsgr = "slider1-message";
    //-------------------
    this.inputEmailNew ="email-new";
    this.inputPasswordNew ="password-new";
    this.inputPasswordNew2 ="password-new2";
    this.signOutButton ="sign-out-button";
    this.signInAreaMsgr2 = "slider2-message";
    this.init();


};

MainPageView.prototype = {
    init: function () {
        this.setDOMElements();
        this.setupHandlers();
        this.addHandlers();
        this.enable();

    },
    setDOMElements: function () {
        // Слайдер аутентификации на главной странице сайта. При клике на их верхнее меню (т.н. табы) показывается соответствующий слайд
        for (var i = 0; i < this.slides.length; i++) {
            this.slides[i] = document.getElementById(this.slides[i]);// перезаписываем в массив сами элементы
            this.tabs[i] = document.getElementById(this.tabs[i]); // перезаписываем в массив сами элементы

        }
        //Search for SignIn and SignUp buttons
        this.signInButton = document.getElementById(this.signInButton);
        this.signOutButton = document.getElementById(this.signOutButton);
        //Input elements for SignIn slide
        this.inputEmail = document.getElementById(this.inputEmail);
        this.inputPassword = document.getElementById(this.inputPassword);
        //Input elements for SignOut slide
        this.inputEmailNew = document.getElementById(this.inputEmailNew);
        this.inputPasswordNew = document.getElementById(this.inputPasswordNew);
        this.inputPasswordNew2 = document.getElementById(this.inputPasswordNew2);
        //Group necessary elements
        this.slider1Set = [this.inputEmail, this.inputPassword, this.signInButton];
        this.slider2Set = [this.inputEmailNew, this.inputPasswordNew, this.inputPasswordNew2, this.signOutButton];
        //Other elements
        this.signInAreaMsgr = document.getElementById(this.signInAreaMsgr);
        this.signInAreaMsgr2 = document.getElementById(this.signInAreaMsgr2);

    },
    setupHandlers: function () {
        this.showSlideHandler = this.showSlide.bind(this);
        this.tabClickHandler = this.tabClick.bind(this);
        this.signInButtonHandler = this.signInButtonClick.bind(this);
        this.signOutButtonHandler = this.signOutButtonClick.bind(this);
        this.frozeSlideHandler = this.frozeSlide.bind(this);
        this.sliderMessageHandler = this.sliderMessage.bind(this);
        this.redirectHandler = this.redirect.bind(this);


    },
    addHandlers: function () {
        // Slider Tabs
        for (var i = 0; i < this.slides.length; i++) {
            this.tabs[i].addEventListener('click', this.tabClickHandler); // Каждому табу назначаем обработчика по событию click
        }
        //Slider button
        this.signInButton.addEventListener('click', this.signInButtonHandler); // Назначаем обработчик по клику для кнопки авторизации
        this.signOutButton.addEventListener('click', this.signOutButtonHandler);// Назначаем обработчик по клику для кнопки регистрации
    },
    enable: function () {
        radio.on('slider/showSlideByTab',this.showSlideHandler);
        radio.on("auth/holdArea", this.frozeSlideHandler);
        radio.on("auth/unHoldArea", this.frozeSlideHandler);
        radio.on("slider/showMessage", this.sliderMessageHandler);
        radio.on("signOut/holdArea", this.frozeSlideHandler);
        radio.on("signOut/unHoldArea", this.frozeSlideHandler);
        radio.on('auth/redirectToProfile', this.redirectHandler);

    },
    tabClick: function (el) {
        radio.trigger('slider/tabClick', el);
    },
    showSlide: function (el) {
        for (var i = 0; i < this.slides.length; i++) {
            this.slides[i].className = "slide-disable"; // убираем все слайды, В массиве уже записаны не id, а сами элементы
            this.tabs[i].className = "slider-tab-active";
        }
        var index = this.tabs.indexOf(el.target); // Находим номер кликнутого таба в массиве
        this.slides[index].className = "slide-active"; // и показываем соответствующий слайдер
        el.target.className = "slider-tab-inactive";
    },
    signInButtonClick: function () {
        radio.trigger('auth/authInButtonClick', [this.inputEmail.value, this.inputPassword.value]);


    },
    signOutButtonClick: function () {
        radio.trigger('signOut/signOutButtonClick', [this.inputEmailNew.value, this.inputPasswordNew.value, this.inputPasswordNew2.value]);

    },
    frozeSlide: function (param) {


        var slideEl, slideSet;
        var frozeParam;
        if (param[0] === "slider1") {
            slideEl = this.slides[0];
            slideSet = this.slider1Set;
        } else if (param[0] === "slider2") {
            slideEl = this.slides[1];
            slideSet = this.slider2Set;
        } else {return}
        if (param[1] == true) {
            frozeParam = true;
            slideEl.className = "slide-frozen";
            setTimeout(function () {
                slideEl.className = "slide-active";
            }, 2000);
        } else {
            frozeParam = false;
        }
        for (var i = 0; i < slideSet.length; i++) {
            slideSet[i].disabled = frozeParam;
        }
    },
    sliderMessage: function (info) {
        var messager;
        var errorType = info[1];
        if (info[0] == 'authInMessage') {
            messager = this.signInAreaMsgr;
        } else if (info[0] == 'signOutMessage') {
            messager = this.signInAreaMsgr2;
        } else {return}
        messager.className = "message-active";
        switch (info[1]){
            case 'No Email': messager.innerHTML = 'Пожалуйста, напишите E-mail';
            break;
            case 'No Password':  messager.innerHTML = 'Пожалуйста, введите пароль';
            break;
            case 'auth/wrong-password': messager.innerHTML = 'Вы указали неправильный пароль';
            break;
            case 'auth/invalid-email': messager.innerHTML = 'E-mail указан неправильно';
            break;
            case 'auth/user-not-found': messager.innerHTML = 'Такого пользователя не существует';
            break;
            case 'auth/network-request-failed': messager.innerHTML = 'Ошибка сети. Проверьте соединение с Интернетом и попробуйте еще раз';
            break;
            case 'No Error': messager.innerHTML = 'Авторизация...';
            break;
            case 'Start registration': messager.innerHTML = 'Регистрация...';
            break;
            case 'Wrong passport repeat': messager.innerHTML = 'Пароли не совпадают';
            break;
            case 'auth/weak-password': messager.innerHTML = 'Ваш пароль очень простой, придумайте сложнее';
            break;
            case 'auth/invalid-email': messager.innerHTML = 'E-mail указан неправильно';
            break;
            default: messager.innerHTML = info[2];
        }
    },
    redirect: function (location) {
        window.location = location;
    }
};