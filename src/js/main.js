"use strict";

const $PAGE = document.querySelector(".page");
const $LOGO = document.querySelector(".header__label");
const $FORM_OPEN_BTN = document.querySelector(".header__registr-button");
const $FORM = document.forms.registration;
const $SKIP_BUTTON = document.querySelector(".form__skip");
const $BACK_BUTTON = document.querySelector(".form__back");
const $SUBMIT = document.querySelector(".form__button");
const $INPUTS = document.querySelectorAll(".form__input");
const $PAGE_FORM = document.querySelector(".page__form");
const $PAGE_TABLE = document.querySelector(".page__table");
const $TABLE_BODY = document.querySelector(".table__body");

const STORAGE_LIST = localStorage.getItem("data");
let usersList = STORAGE_LIST ? JSON.parse(STORAGE_LIST) : [];

const setLocalStorage = (data) =>
    localStorage.setItem("data", JSON.stringify(data));

const switchPages = () => {
    switch ($PAGE.dataset.page) {
        case "form":
            $PAGE_FORM.classList.remove("d-n");
            $PAGE_TABLE.classList.add("d-n");
            break;
        case "table":
            $PAGE_FORM.classList.add("d-n");
            $PAGE_TABLE.classList.remove("d-n");
            window.scrollTo(0, 0);
            break;
        default:
            break;
    }
};

const addNewUser = () => {
    $PAGE.setAttribute("data-page", "form");
    switchPages();
};

const removeWarningBorder = (input) => {
    input.classList.remove("form__input--error");
    input.classList.remove("form__input--success");

    const $SPAN = input?.nextElementSibling;
    $SPAN.classList.remove("form__span--error");
};

const skipForm = () => {
    const $COLUMN_FORM1 = document.querySelector(".form__column-one");
    const $COLUMN_FORM2 = document.querySelector(".form__column-two");

    if ($FORM.dataset.formPart === "second") {
        $COLUMN_FORM1.classList.add("form__column-one--transform");
        $COLUMN_FORM2.classList.add("form__column-two--transform");
        $BACK_BUTTON.classList.remove("form__ajast--active");
        $SKIP_BUTTON.classList.add("form__ajast--active");
    } else {
        $COLUMN_FORM2.classList.remove("form__column-two--transform");
        $COLUMN_FORM1.classList.remove("form__column-one--transform");
        $BACK_BUTTON.classList.add("form__ajast--active");
        $SKIP_BUTTON.classList.remove("form__ajast--active");
    }
};

const resetForm = () => {
    $FORM.reset();
    for (let input of $INPUTS) {
        removeWarningBorder(input);
    }
};

const toggleCommonSpan = (state) => {
    const $COMMON_SPAN = document.querySelector(".form__fields-check");

    state === "error"
        ? $COMMON_SPAN.classList.add("form__span--error")
        : $COMMON_SPAN.classList.remove("form__span--error");
};

const backToHome = () => {
    resetForm();
    $PAGE.setAttribute("data-page", "table");
    switchPages();
    $FORM.removeAttribute("data-form-part");
    skipForm();
    toggleCommonSpan("success");
};

$FORM_OPEN_BTN.addEventListener("click", addNewUser);
$LOGO.addEventListener("click", backToHome);

const removeUserData = (e) => {
    const DELETE_BUTTON = e.target;
    if (DELETE_BUTTON.dataset.role === "delete") {
        const ID = DELETE_BUTTON.parentElement.dataset.id;
        usersList = usersList.filter((user) => user.id !== parseInt(ID));
        setLocalStorage(usersList);
        renderUsersTable();
    }
};

const editUserData = (e) => {
    const EDIT_BUTTON = e.target;
    if (EDIT_BUTTON.dataset.role === "change") {
        const ID = EDIT_BUTTON.parentElement.dataset.id;

        usersList.forEach((user) => {
            if (user.id === parseInt(ID)) {
                $PAGE_TABLE.classList.add("d-n");
                $PAGE_FORM.classList.remove("d-n");
                $FORM.setAttribute("data-editId", ID);
                for (let key in user) {
                    for (let input of $INPUTS) {
                        if (key === input.id) {
                            input.value = user[key];
                        }
                    }
                }
            }
        });
    }
};

const createTrElement = (user) => {
    const newTr = document.createElement("tr");
    newTr.innerHTML = `
    <td
                data-cell="name"
                class="table__body-column"
            >
            ${user.name} ${user.surname}
            </td>
        <td
            data-cell="age"
            class="table__body-column"
        >
        ${user.age}
        </td>
        <td
            data-cell="gmail"
            class="table__body-column"
        >
        ${user.gmail}
        </td>
        <td
            data-cell="phone"
            class="table__body-column"
        >
        ${user.phone}
        </td>
        <td
            data-id=${user.id}
            class="table__body-column table__body-column-btns"
        >
            <button
                class="table__button table__button--red"
                type="button"
                data-role="delete"
            >
                delete
            </button>
            <button
                class="table__button table__button--blue"
                type="button"
                data-role="change"
            >
                change
            </button>
        </td>`;
    $TABLE_BODY.appendChild(newTr);

    newTr.addEventListener("click", removeUserData);
    newTr.addEventListener("click", editUserData);
};

function renderUsersTable() {
    $TABLE_BODY.innerHTML = "";
    const USERS = JSON.parse(localStorage.getItem("data"));

    USERS?.forEach((user) => {
        createTrElement(user);
    });
}

renderUsersTable();

const regExpValidation = {
    name: {
        pattern: /\b[A-Z][a-z]{2,10}\b/,
        error: "Name must consist at list 2 characters",
    },

    surname: {
        pattern: /\b[A-Z][a-z]{2,10}\b/,
        error: "Surname must consist at list 2 characters",
    },

    age: {
        pattern: /\b^[1-9]{1}[0-9]?$\b/,
        error: "Age must be valid",
    },

    phone: {
        pattern: /^[+]{1}\d{12}$/m,
        error: "Age must be valid",
    },

    gmail: {
        pattern: /.{2,15}@(gmail|hotmail)\.com/,
        error: "Gmail must be valid!",
    },

    password: {
        pattern: /(?=.*[A-Z]){1,}(?=.*[a-z]){1,}[0-9 A-z]{8,10}/,
        error: "Password must consist at least 8 characters at most 10, one from them upper and one lower registr",
    },
};

const compareFunction = (userInputObj) => {
    let fieldCount = 0;
    let matchFields = 0;

    for (const key in userInputObj) {
        fieldCount++;

        if (
            regExpValidation[key] &&
            !regExpValidation[key].pattern.test(userInputObj[key].trim())
        ) {
            const ERROR_SPAN = regExpValidation[key].error;
            checkInput(key, ERROR_SPAN);
        } else {
            matchFields++;
        }
    }

    return fieldCount === matchFields;
};

const restructureWord = (word) => {
    const pattern = /[A-Z]/g;
    const INDEX_SECOND_UPPER_LETTER = word.search(pattern);

    const LETTER_BEFORE_DASH = word[INDEX_SECOND_UPPER_LETTER - 1];
    word = word.replace(LETTER_BEFORE_DASH, `${LETTER_BEFORE_DASH}-`);

    return word.charAt(0).toUpperCase() + word.slice(1);
};

const checkRequiredField = (userInputObj) => {
    let fieldCount = 0;
    let errorFields = 0;

    for (let [key, value] of Object.entries(userInputObj)) {
        fieldCount++;

        if (value.trim() === "") {
            checkInput(key, `${restructureWord(key)} is required!`);
            errorFields++;
        }
    }

    return fieldCount - errorFields === fieldCount;
};

const comparePasswords = (rePasswordObj) => {
    const PASSWORD_VALUE = document.getElementById("password").value;

    for (const [key, value] of Object.entries(rePasswordObj)) {
        if (key === "rePassword" && value.trim() !== PASSWORD_VALUE.trim()) {
            checkInput(key, "Passwords not match!");
            return false;
        }
    }

    return true;
};

const addErrorClass = (input, message) => {
    input.classList.remove("form__input--success");
    input.classList.add("form__input--error");

    const $SPAN = input?.nextElementSibling;
    $SPAN.classList.add("form__span--error");
    $SPAN.textContent = message;

    toggleCommonSpan("error");

    input.addEventListener("change", () => {
        const { id, value } = input;
        if (
            checkRequiredField({ [id]: value }) &&
            compareFunction({ [id]: value }) &&
            comparePasswords({ [id]: value })
        ) {
            addSuccessClass(input);
        }
    });
};

const addSuccessClass = (input) => {
    removeWarningBorder(input);
    input.classList.add("form__input--success");
    const { id, value } = input;
    if (
        !checkRequiredField({ [id]: value }) &&
        !compareFunction({ [id]: value }) &&
        !comparePasswords({ [id]: value })
    ) {
        addErrorClass(input);
    }
};

const checkInput = (elementId, message) => {
    for (let input of $INPUTS) {
        if (input.id === elementId) {
            addErrorClass(input, message);
        }
    }
};

const sentUserData = () => {
    setTimeout(() => {
        backToHome();
    }, 2000);
};

$FORM.addEventListener("submit", (event) => {
    event.preventDefault();
    const {
        name: { value: name },
        surname: { value: surname },
        age: { value: age },
        phone: { value: phone },
        gmail: { value: gmail },
        password: { value: password },
        rePassword: { value: rePassword },
    } = $FORM.elements;

    const RESULT_COMPARE_PASS = comparePasswords({ rePassword });

    const RESULT_REQUIRED = compareFunction({
        name,
        surname,
        age,
        phone,
        gmail,
        password,
    });

    const RESULT_VALID = checkRequiredField({
        name,
        surname,
        age,
        phone,
        gmail,
        password,
        rePassword,
    });

    if (RESULT_REQUIRED && RESULT_VALID && RESULT_COMPARE_PASS) {
        if (!$FORM.getAttribute("data-editId")) {
            const USER_DATA = {
                name,
                surname,
                age,
                phone,
                gmail,
                id: Math.floor(Math.random() * 100),
                password,
                rePassword,
            };

            usersList.push(USER_DATA);
            setLocalStorage(usersList);
            renderUsersTable();
            sentUserData();
        } else {
            const EDIT_USER_ID = $FORM.getAttribute("data-editId");
            usersList.forEach((user) => {
                if (user.id === parseInt(EDIT_USER_ID)) {
                    user.name = name;
                    user.age = age;
                    user.surname = surname;
                    user.phone = phone;
                    user.gmail = gmail;
                    user.password = password;
                    user.rePassword = rePassword;
                }
            });

            $FORM.removeAttribute("data-editId");
            setLocalStorage(usersList);
            renderUsersTable();
            sentUserData();
        }
    }
});

$SKIP_BUTTON.addEventListener("click", () => {
    $FORM.setAttribute("data-form-part", "second");
    skipForm();
});

$BACK_BUTTON.addEventListener("click", () => {
    $FORM.removeAttribute("data-form-part");
    skipForm();
});

(function () {
    try {
        var allTables = document.querySelectorAll("table");
        for (var i = 0; i < allTables.length; i++) {
            allTables[i].setAttribute("role", "table");
        }
        var allCaptions = document.querySelectorAll("caption");
        for (var i = 0; i < allCaptions.length; i++) {
            allCaptions[i].setAttribute("role", "caption");
        }
        var allRowGroups = document.querySelectorAll("thead, tbody, tfoot");
        for (var i = 0; i < allRowGroups.length; i++) {
            allRowGroups[i].setAttribute("role", "rowgroup");
        }
        var allRows = document.querySelectorAll("tr");
        for (var i = 0; i < allRows.length; i++) {
            allRows[i].setAttribute("role", "row");
        }
        var allCells = document.querySelectorAll("td");
        for (var i = 0; i < allCells.length; i++) {
            allCells[i].setAttribute("role", "cell");
        }
        var allHeaders = document.querySelectorAll("th");
        for (var i = 0; i < allHeaders.length; i++) {
            allHeaders[i].setAttribute("role", "columnheader");
        }

        var allRowHeaders = document.querySelectorAll("th[scope=row]");
        for (var i = 0; i < allRowHeaders.length; i++) {
            allRowHeaders[i].setAttribute("role", "rowheader");
        }
    } catch (e) {
        console.log("AddTableARIA(): " + e);
    }
})();
