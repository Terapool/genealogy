window.onload = function () {
    var myPersons = [];
    var myPersonsTemp = [];
    var currentElement; // Global var for current el
    setSignOutHandler();
    var loadUserTimer = setInterval(prepareUserSettings, 500); // Получаем юзера из БД
    addButtonHandler();


    function prepareUserSettings() {
        var user = firebase.auth().currentUser; // Current user
        if (user) { // После того, как прошла аутентификация
            clearInterval(loadUserTimer); // убираем
        } else {
            return
        }
        var headerUser = document.getElementById("cabinet-header-user");
        var preloader = document.getElementById("cabinet-header-preloader");
        preloader.style.display = "none";
        headerUser.innerHTML = user.email;
        // Если есть записи, читаем их
        var ref = firebase.database().ref("users/" + user.uid);
        var reader = ref.once('value').then(function (dataSnapshot) {
            if (dataSnapshot.val()) {
                myPersons = dataSnapshot.val().persons;
                console.log('БД подтянута');
            } else {
                console.log('БД у юзера не создана');
            }
        });
        // Ставим Listener на изменения
        ref = firebase.database().ref("users/" + user.uid + "/persons");
        ref.on('value', function (snapshot) {
            if (snapshot.val()) {
                myPersons = snapshot.val();// Если snapshot.val() не null, то пускай остается []
            }
            clearTree();
            buildTree();
        });
    }

    function addPersonToDB(person) {
        var user = firebase.auth().currentUser; // Current user
        var ref = firebase.database().ref("users/" + user.uid + "/persons/" + person.id);
        ref.set(person);
        console.log("В БД записан пользователь с id" + person.id);
    }
    function rewritePersonsInDB() {
        var user = firebase.auth().currentUser; // Current user
        var ref = firebase.database().ref("users/" + user.uid + "/persons");
        ref.set(null);
        console.log("Стерли всех пользователей в БД");
        for (var i=0; i < myPersonsTemp.length; i++) {
            addPersonToDB(myPersonsTemp[i]);
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

    function addButtonHandler() { // Назначаем обработчика для кнопки "Добавить карточку"
        var addButton = document.getElementById("button-add-person");
        addButton.addEventListener("click", buttonHandler, false);

    }

    function checkPhoto(obj) {
        var file = obj.target.files[0];
        var photoPlace = document.getElementById("photoChange");
        var warnPlace = document.getElementById("warning-message"); // p tag for errors
        if (file) {
            var name = file.name;
            var type = file.type;
            var size = file.size;
            // Check for the correct file type
            if (!(type === "image/gif" || type === "image/png" || type === "image/jpg" || type === "image/jpeg")) {
                warnPlace.innerHTML = "Выбирать можно только изображения в формате<br /> jpg, jpeg, gif, png";
                return false;
            }
        } else {
            // file is not selected
            warnPlace.innerHTML = "Вы не выбрали файл";
            return false;
        }
        // Loads photo to the cloud
        var user = firebase.auth().currentUser; // Current user
        var now = Date.now();
        var ext;
        if (type === "image/gif") {
            ext = "gif";
        } else if (type === "image/png") {
            ext = "png";
        } else if (type === "image/jpg") {
            ext = "jpg";
        } else if (type === "image/jpeg") {
            ext = "jpeg";
        }
        var storageRef = firebase.storage().ref("user-images/" + user.uid + "/" + now + "." + ext);
        var uploadTask = storageRef.put(file);
        uploadTask.on('state_changed', function (snapshot) {

            warnPlace.innerHTML = "Подгружаю фото, подождите";
        }, function (error) {
            // Handle unsuccessful uploads
        }, function () {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            var downloadURL = uploadTask.snapshot.downloadURL;
            warnPlace.innerHTML = "Фото успешно загружено";
            photoPlace.setAttribute('src', downloadURL);
        });

        console.log(name, type, size);
    }

    function buttonHandler() { // Обработчик для кнопки "Добавить карточку"
        var dialogW = document.getElementById("dialog-window");
        clearDialogWindow();
        dialogW.style.display = "block";


    }

    function clearDialogWindow() {
        document.getElementById("name").value = "";
        document.getElementById("date").value = "";
        document.getElementById("dialog-window-cancel").addEventListener("click", cancelDialogWindow, false);
        document.getElementById("dialog-window-ok").addEventListener("click", createNewPerson, false);
        document.getElementById("photoChange").setAttribute('src', 'img/photo-placeholder.gif');
        document.getElementById("warning-message").innerHTML=" ";
        var control = document.getElementById("your-files");
        control.addEventListener("change", checkPhoto, false);
        control.value = "";
    }

    function cancelDialogWindow() {
        var dialogW = document.getElementById("dialog-window");
        dialogW.style.display = "none";
    }

    // Persons

    function PersonConstr(id, photoUrl, name, birthDate, level, rel) {
        this.id = id;
        this.photoUrl = photoUrl;
        this.name = name;
        this.birthDate = birthDate;
        this.level = level;
        this.rel = rel;
    }

    function createNewPerson(photoUrl) {
        // Читаем форму
        var id = myPersons.length; // id for new person. 0 - 1st person, 1 - 2nd, etc.
        var name = document.getElementById("name").value;
        var birthDate = document.getElementById("date").value;
        var selectTagEl = document.getElementById("set-rel"); // Определяем, кто выбран (брат, сестра и т.д.)
        var selectedIndex = selectTagEl.options.selectedIndex;
        var level = selectTagEl.options[selectedIndex].value; // Уровень в иерархии карточек
        var rel = selectTagEl.options[selectedIndex].text; // Комментарий карточки (бабушка, дедушка)
        var photoUrl = document.getElementById("photoChange").getAttribute('src');
        // Создаем объект в массиве карточек
        myPersons[id] = new PersonConstr(id, photoUrl, name, birthDate, level, rel);
        // Сохраняем его в БД
        addPersonToDB(myPersons[id]);
        console.log(myPersons);
        cancelDialogWindow();
    }

    function displayPerson(id) {

        // Создаем элемент карточки с заданным id, персональные данные берутся уже из объекта
        var element = document.createElement("div");
        var parent = document.getElementById(myPersons[id].level);
        element.className = "card";
        element.id = myPersons[id].id;
        // innerHTML content
        var innerContent = "";
        innerContent = '<div class="card-photo"><img src="';
        innerContent += myPersons[id].photoUrl;
        innerContent += '" height="140" width="120"/></div><div class="card-info"><div class="info-comment"><span>';
        innerContent += myPersons[id].rel;
        innerContent += '</span></div><div class="info-name"><span>';
        innerContent += myPersons[id].name;
        innerContent += '</span></div><div class="info-manage-area"><a class="trash-button" title="Удалить карточку"></a></div></div>';
        element.innerHTML = innerContent;
        // Перед вставкой увеличиваем ширину уровня на 280 пикселей, чтобы центрировать
        var levelFactor = parent.querySelectorAll(".card").length; // Number of Cards in the parent level
        levelFactor++; // с учетом того, что сейчас добавится карточка
        var levelFactor = levelFactor * 280; // умножаем количество карточек на ширину 1 карточки с учетом отступов
        parent.style.width = levelFactor + "px";
        parent.insertBefore(element, parent.firstChild); // Вставка элемента
        // Now the var 'element' is a trash button
        element = element.getElementsByClassName('trash-button');
        element[0].addEventListener('click', function () {
            var answ = confirm("Действительно удалить эту карточку?");
            if (answ) {
                console.log("Поступил запрос на удаление карточки с id=" + myPersons[id].id);
                deleteCard(myPersons[id].id);
                rewritePersonsInDB();
            } else {
                console.log("Не будем удалять");
            }
                                            }, false);
        console.log(element);
    }
    function deleteCard(id) {
        myPersonsTemp =[];
        for (var i = 0; i < myPersons.length; i++) {
            if (!(i === id)) {
                myPersonsTemp.push(myPersons[i]);
            }
        }
        console.log(myPersons);
        console.log(myPersonsTemp);
    }

    function buildTree() {
        for (var i = 0; i < myPersons.length; i++) {
            displayPerson(i);
        }
    }

    function clearTree() {
        var arrayOfLevels = ["level0", "level1", "level2", "level3"];
        for (var i = 0; i < arrayOfLevels.length; i++) {
            document.getElementById(arrayOfLevels[i]).innerHTML = '<p class="clear" />';
        }
    }

};


