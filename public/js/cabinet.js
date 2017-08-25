window.onload = function () {
    setSignOutHandler();
    var loadUserTimer = setInterval(prepareUserSettings, 500);
    addButtonHandler();
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
    function addButtonHandler () { // Назначаем обработчика для кнопки "Добавить карточку"
        var addButton = document.getElementById("button-add-person");
        addButton.addEventListener("click", buttonHandler, false);
    }
    function buttonHandler () { // Обработчик для кнопки "Добавить карточку"
        var dialogW = document.getElementById("dialog-window");
        clearDialogWindow();
        dialogW.style.display = "block";

    }
    function clearDialogWindow () {
        document.getElementById("name").value="";
        document.getElementById("date").value="";
        document.getElementById("dialog-window-cancel").addEventListener("click",cancelDialogWindow, false);
        document.getElementById("dialog-window-ok").addEventListener("click",createPerson, false);

    }
    function cancelDialogWindow() {
        var dialogW = document.getElementById("dialog-window");
        dialogW.style.display = "none";
    }

    // Persons

    var myPersons = [];
    function PersonConstr (id, photoUrl, name, birthDate, level, rel) {
        this.id = id;
        this.photoUrl = photoUrl;
        this.name = name;
        this.birthDate = birthDate;
        this.level = level;
        this.rel = rel;
    }
    function createPerson () {
        // Читаем форму
        var id = myPersons.length; // id for new person. 0 - 1st person, 1 - 2nd, etc.
        var name = document.getElementById("name").value;
        var birthDate = document.getElementById("date").value;
        var selectTagEl = document.getElementById("set-rel"); // Определяем, кто выбран (брат, сестра и т.д.)
        var selectedIndex = selectTagEl.options.selectedIndex;
        var level = selectTagEl.options[selectedIndex].value; // Уровень в иерархии карточек
        var rel = selectTagEl.options[selectedIndex].text; // Комментарий карточки (бабушка, дедушка)
        var photoUrl = "img/photo-placeholder.gif";
        // Создаем объект в массиве карточек
        myPersons[id] = new PersonConstr (id, photoUrl, name, birthDate, level, rel);
        console.log(myPersons);
        // Создаем элемент карточки с заданным id, персональные данные берутся уже из объекта
        var element = document.createElement("div");
        var parent = document.getElementById(myPersons[id].level);
        element.className = "card";
        element.id = myPersons[id].id;
        // innerHTML content
        var innerContent="";
        innerContent = '<div class="card-photo"><img src="';
        innerContent += myPersons[id].photoUrl;
        innerContent +='" height="140" width="120"/></div><div class="card-info"><div class="info-comment"><span>';
        innerContent += myPersons[id].rel;
        innerContent += '</span></div><div class="info-name"><span>';
        innerContent += myPersons[id].name;
        innerContent += '</span></div><div class="info-manage-area"></div></div>';
        element.innerHTML = innerContent;
        // Перед вставкой увеличиваем ширину уровня на 280 пикселей, чтобы центрировать
        var levelFactor = parent.querySelectorAll(".card").length; // Number of Cards in the parent level
        levelFactor++; // с учетом того, что сейчас добавится карточка
        var levelFactor = levelFactor * 280; // умножаем количество карточек на ширину 1 карточки с учетом отступов
        parent.style.width = levelFactor + "px";
        parent.insertBefore(element, parent.firstChild); // Вставка элемента
        cancelDialogWindow();
    }


};


