window.onload = function () {
    sliders(); // Управляем ссылками Вход/Регистрация и соотв. формами
    procForms();
    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            window.location = "famtree.htm";
        }
    });

    // [END authstatelistener]
};
// END window.onload
function sliders() {   // Слайдеры аутентификации на главной странице сайта
    var slides = ["slider1", "slider2", "slider3"]; // Указываем id слайдеров
    var tabs = ["slider1-tab", "slider2-tab", "slider3-tab"]; //Указываем  id табов от них, массив такой же длины
    for (var i = 0; i < slides.length; i++) {
        slides[i] = document.getElementById(slides[i]);// перезаписываем в массив сами элементы
        tabs[i] = document.getElementById(tabs[i]); // перезаписываем в массив сами элементы
        tabs[i].onclick = switchSlider; // После того, как мы получили все элементы-табы, назначаем им обработчика по событию click
    }
    function switchSlider(el) {
        for (var i = 0; i < slides.length; i++) {
            slides[i].className = "slide-disable"; // убираем все слайды
            tabs[i].className = "slider-tab-active";
        }
        var index = tabs.indexOf(el.target); // Находим номер кликнутого таба в массиве
        slides[index].className = "slide-active"; // и показываем соответствующий слайдер
        el.target.className = "slider-tab-inactive";
    }
}

// назначаем обработчик для кнопки авторизации в слайдер 1
function procForms() {
    var authinbutton = document.getElementById("authinbutton");
    var registerbutton = document.getElementById("registerbutton");
    authinbutton.addEventListener('click', toggleSignIn, false);
    registerbutton.addEventListener('click', handleSignUp, false);
}
// Обработчик - регистрация нового пользователя
function handleSignUp()
{
    makeFrozen("slider2", ["emailnew", "passwordnew", "passwordnew2", "registerbutton"], true);
    var email = document.getElementById('emailnew').value;
    var pswd = document.getElementById('passwordnew').value;
    var pswdRepeat = document.getElementById('passwordnew2').value;
    if (email.length < 4) {
        sliderMessage('Пожалуйста, напишите E-mail', "slider2-message");
        makeFrozen("slider2", ["emailnew", "passwordnew", "passwordnew2", "registerbutton"], false);
        return;
    } else if (pswd.length < 4) {
        sliderMessage('Пожалуйста, указывайте пароль длинее 3-х символов', "slider2-message");
        makeFrozen("slider2", ["emailnew", "passwordnew", "passwordnew2", "registerbutton"], false);
        return;
    } else if (pswd!== pswdRepeat) {
        sliderMessage('Пароли не совпадают', "slider2-message");
        makeFrozen("slider2", ["emailnew", "passwordnew", "passwordnew2", "registerbutton"], false);
        return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, pswd).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            sliderMessage('Ваш пароль очень простой, придумайте сложнее', "slider2-message");
        } else if (errorCode == 'auth/invalid-email') {
            sliderMessage("E-mail указан неправильно", "slider2-message");
        } else {
            alert(errorMessage);
            sliderMessage(errorMessage, "slider2-message");
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END createwithemail]
    makeFrozen("slider2", ["emailnew", "passwordnew", "passwordnew2", "registerbutton"], false);

}

// Обработчик нажатия кнопки авторизации
function toggleSignIn() {
    makeFrozen("slider1", ["email", "password", "authinbutton"], true);
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();  // Разлогиниваем старых пользователей
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
    }
    if (email.length < 4) {
        sliderMessage('Пожалуйста, напишите E-mail', "slider1-message");
        makeFrozen("slider1", ["email", "password", "authinbutton"], false);
        return;
    }
    if (password.length < 4) {
        sliderMessage('Пожалуйста, введите пароль', "slider1-message");
        makeFrozen("slider1", ["email", "password", "authinbutton"], false);
        return;
    }
    // Sign in with email and pass.
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
            sliderMessage('Вы указали неправильный пароль', "slider1-message");

        } else if (errorCode === 'auth/invalid-email') {
            sliderMessage('E-mail указан неправильно', "slider1-message");

        } else if (errorCode === 'auth/user-not-found') {
            sliderMessage('Такого пользователя не существует', "slider1-message");

        } else if (errorCode === 'auth/network-request-failed') {
            sliderMessage('Ошибка сети. Проверьте соединение с Интернетом и попробуйте еще раз', "slider1-message");

        } else {
            sliderMessage(errorMessage, "slider1-message");
            console.log(errorCode);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END authwithemail]
    makeFrozen("slider1", ["email", "password", "authinbutton"], false);

}

function sliderMessage(msg, id) {
    var msgPlace = document.getElementById(id);
    msgPlace.className = "message-active";
    msgPlace.innerHTML = msg;
    return true;
}

function makeFrozen(slider, inputs, frozenOrNot) {
    var disabledParam,
        mySlider = document.getElementById(slider);

    if (frozenOrNot) {
        disabledParam = true;
        mySlider.className = "slide-frozen";
        setTimeout(function () {
            mySlider.className = "slide-active";
        }, 2000);
    } else {
        disabledParam = false;
    }
    document.getElementById(slider).className = "slide-frozen";
    setTimeout(function () {
        document.getElementById(slider).className = "slide-active";
    }, 2000);
    function melt() {
    }

    for (var i = 0; i < inputs.length; i++) {
        document.getElementById(inputs[i]).disabled = disabledParam;
    }

}

