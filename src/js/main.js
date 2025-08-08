"use strict";

import {
    $FORM,
    $FORM_OPEN_BTN,
    $LOGO,
    $TABLE_BODY,
    $SKIP_BUTTON,
    $BACK_BUTTON,
    $INPUTS
} from "./dom.js";
import { getLocalStorageData, setLocalStorageData } from "./storage.js";
import {
    checkRequiredFields,
    validateWithRegExp,
    comparePasswords,
    addErrorClass,
    addSuccessClass,
    toggleCommonSpan,
    regExpValidation
} from "./validation.js";
import {
    switchPages,
    renderUsersTable,
    resetForm,
    fillFormWithUserData,
    skipForm,
} from "./ui.js";

let usersList = getLocalStorageData();

const sentUserData = () => {
    setTimeout(() => {
        backToHome();
    }, 2000);
};

const backToHome = () => {
    resetForm();
    $FORM.removeAttribute("data-form-part");
    $FORM.removeAttribute("data-editId");
    skipForm();
    switchPages("table");
    toggleCommonSpan("success");
};

const addNewUser = () => {
    switchPages("form");
    resetForm();
    toggleCommonSpan("success");
};

const handleTableClick = (e) => {
    const target = e.target;
    if (target.dataset.role === "delete") {
        const id = parseInt(target.parentElement.dataset.id);
        usersList = usersList.filter((user) => user.id !== id);
        setLocalStorageData(usersList);
        renderUsersTable(usersList);
    } else if (target.dataset.role === "change") {
        const id = parseInt(target.parentElement.dataset.id);
        const userToEdit = usersList.find((user) => user.id === id);
        if (userToEdit) {
            $FORM.setAttribute("data-editId", id);
            fillFormWithUserData(userToEdit);
            switchPages("form");
        }
    }
};

const handleInputBlur = (event) => {
    const input = event.target;
    const { id, value } = input;


    if (value.trim() === "") {
        addErrorClass(input, "This field is required!");
        return; 
    }

    const validationRule = regExpValidation[id];
    if (validationRule && !validationRule.pattern.test(value.trim())) {
        addErrorClass(input, validationRule.error);
        return; 
    }

    if (id === "rePassword" && $FORM.elements.password.value !== value) {
        addErrorClass(input, "Passwords do not match!");
        return; 
    }

    addSuccessClass(input);
};


const handleSubmit = (event) => {
    event.preventDefault();

    const {
        name,
        surname,
        age,
        phone,
        gmail,
        password,
        rePassword,
    } = $FORM.elements;

    const formData = {
        name: name.value,
        surname: surname.value,
        age: age.value,
        phone: phone.value,
        gmail: gmail.value,
        password: password.value,
        rePassword: rePassword.value,
    };

    let isFormValid = true;

    if (!checkRequiredFields(formData)) isFormValid = false;
    if (!validateWithRegExp(formData)) isFormValid = false;
    if (!comparePasswords(formData.password, formData.rePassword)) isFormValid = false;
    
    if (isFormValid) {
        const isEditing = $FORM.getAttribute("data-editId");
        if (!isEditing) { 
            const isEmailTaken = usersList.some(user => user.gmail === formData.gmail);

            if (isEmailTaken) {
                const input = $FORM.elements.gmail;
                addErrorClass(input, "This email is already in use!");
                isFormValid = false;
            }
        }
    }

    if (isFormValid) {
        toggleCommonSpan("success", "");
        const isEditing = $FORM.getAttribute("data-editId");
        if (isEditing) {
            usersList.forEach((user) => {
                if (user.id === parseInt(isEditing)) {
                    Object.assign(user, formData);
                }
            });
            $FORM.removeAttribute("data-editId");
        } else {
            const newUser = {
                ...formData,
                id: Math.floor(Math.random() * 100),
            };
            usersList.push(newUser);
        }
        setLocalStorageData(usersList);
        renderUsersTable(usersList);
        sentUserData();
    } else {
        toggleCommonSpan("error", "All fields must be filled correctly!");
    }
};

$FORM_OPEN_BTN.addEventListener("click", addNewUser);
$LOGO.addEventListener("click", backToHome);
$TABLE_BODY.addEventListener("click", handleTableClick);
$FORM.addEventListener("submit", handleSubmit);
$SKIP_BUTTON.addEventListener("click", () => {
    $FORM.setAttribute("data-form-part", "second");
    skipForm();
});
$BACK_BUTTON.addEventListener("click", () => {
    $FORM.removeAttribute("data-form-part");
    skipForm();
});

[...$INPUTS].forEach(input => {
    input.addEventListener("blur", handleInputBlur);
});

renderUsersTable(usersList);
switchPages("table");

// ARIA roles for table
(function () {
    try {
        let allTables = document.querySelectorAll("table");
        for (let i = 0; i < allTables.length; i++) {
            allTables[i].setAttribute("role", "table");
        }
        let allCaptions = document.querySelectorAll("caption");
        for (let i = 0; i < allCaptions.length; i++) {
            allCaptions[i].setAttribute("role", "caption");
        }
        let allRowGroups = document.querySelectorAll("thead, tbody, tfoot");
        for (let i = 0; i < allRowGroups.length; i++) {
            allRowGroups[i].setAttribute("role", "rowgroup");
        }
        let allRows = document.querySelectorAll("tr");
        for (let i = 0; i < allRows.length; i++) {
            allRows[i].setAttribute("role", "row");
        }
        let allCells = document.querySelectorAll("td");
        for (let i = 0; i < allCells.length; i++) {
            allCells[i].setAttribute("role", "cell");
        }
        let allHeaders = document.querySelectorAll("th");
        for (let i = 0; i < allHeaders.length; i++) {
            allHeaders[i].setAttribute("role", "columnheader");
        }
        let allRowHeaders = document.querySelectorAll("th[scope=row]");
        for (let i = 0; i < allRowHeaders.length; i++) {
            allRowHeaders[i].setAttribute("role", "rowheader");
        }
    } catch (e) {
        console.log("AddTableARIA(): " + e);
    }
})();