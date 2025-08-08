"use strict";

import {
    $TABLE_BODY,
    $PAGE,
    $PAGE_FORM,
    $PAGE_TABLE,
    $INPUTS,
    $COLUMN_FORM1,
    $COLUMN_FORM2,
    $SKIP_BUTTON,
    $BACK_BUTTON,
    $FORM,
} from "./dom.js";
import { removeWarningBorder } from "./validation.js";

export const switchPages = (pageName) => {
    if (pageName === "form") {
        $PAGE_FORM.classList.remove("d-n");
        $PAGE_TABLE.classList.add("d-n");
    } else if (pageName === "table") {
        $PAGE_FORM.classList.add("d-n");
        $PAGE_TABLE.classList.remove("d-n");
        window.scrollTo(0, 0);
    }
};

export const createTrElement = (user) => {
    const newTr = document.createElement("tr");
    newTr.innerHTML = `
        <td data-cell="name" class="table__body-column">${user.name} ${user.surname}</td>
        <td data-cell="age" class="table__body-column">${user.age}</td>
        <td data-cell="gmail" class="table__body-column">${user.gmail}</td>
        <td data-cell="phone" class="table__body-column">${user.phone}</td>
        <td data-id=${user.id} class="table__body-column table__body-column-btns">
            <button class="table__button table__button--red" type="button" data-role="delete">delete</button>
            <button class="table__button table__button--blue" type="button" data-role="change">change</button>
        </td>`;
    $TABLE_BODY.appendChild(newTr);
};

export const renderUsersTable = (users) => {
    $TABLE_BODY.innerHTML = "";
    if (users && users.length > 0) {
        users.forEach((user) => {
            createTrElement(user);
        });
    }
};

export const fillFormWithUserData = (user) => {
    for (const key in user) {
        const input = [...$INPUTS].find((i) => i.id === key);
        if (input) {
            input.value = user[key];
        }
    }
};

export const resetForm = () => {
    $FORM.reset();
    [...$INPUTS].forEach((input) => {
        removeWarningBorder(input);
    });
};

export const skipForm = () => {
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
