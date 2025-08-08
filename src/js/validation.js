"use strict";

import { $INPUTS, $COMMON_SPAN } from "./dom.js";

export const regExpValidation = {
    name: {
        pattern: /^(?:[A-ZА-ЯЁ][a-zа-яё]{1,15})(?:-[A-ZА-ЯЁ][a-zа-яё]{1,15})?$/,
        error: "Name must start with a capital letter and be 2-15 characters long",
    },
    surname: {
        pattern: /^(?:[A-ZА-ЯЁ][a-zа-яё]{1,15})(?:-[A-ZА-ЯЁ][a-zа-яё]{1,15})?$/,
        error: "Surname must start with a capital letter and be 2-15 characters long",
    },
    age: {
        pattern: /\b^[1-9]{1}[0-9]?$\b/,
        error: "Age must be valid",
    },
    phone: {
        pattern: /^[+]{1}\d{12}$/m,
        error: "Phone number must be valid",
    },
    gmail: {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        error: "Please enter a valid email address.",
    },
    password: {
        pattern:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        error: "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
    },
};

const restructureWord = (word) => {
    const pattern = /[A-Z]/g;
    const INDEX_SECOND_UPPER_LETTER = word.search(pattern);
    const LETTER_BEFORE_DASH = word[INDEX_SECOND_UPPER_LETTER - 1];
    word = word.replace(LETTER_BEFORE_DASH, `${LETTER_BEFORE_DASH}-`);
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export const removeWarningBorder = (input) => {
    input.classList.remove("form__input--error");
    input.classList.remove("form__input--success");
    const $SPAN = input?.nextElementSibling;
    if ($SPAN) {
        $SPAN.classList.remove("form__span--error");
    }
};

export const addErrorClass = (input, message) => {
    input.classList.remove("form__input--success");
    input.classList.add("form__input--error");
    const $SPAN = input?.nextElementSibling;
    if ($SPAN) {
        $SPAN.classList.add("form__span--error");
        $SPAN.textContent = message;
    }
};

export const addSuccessClass = (input) => {
    removeWarningBorder(input);
    input.classList.add("form__input--success");
};

export const toggleCommonSpan = (state, message) => {
    if (state === "error") {
        $COMMON_SPAN.textContent = message;
        $COMMON_SPAN.classList.add("form__span--error");
    } else {
        $COMMON_SPAN.classList.remove("form__span--error");
    }
};

export const checkRequiredFields = (userInputObj) => {
    let isValid = true;
    for (const [key, value] of Object.entries(userInputObj)) {
        const input = [...$INPUTS].find((i) => i.id === key);
        if (value.trim() === "") {
            addErrorClass(input, `${restructureWord(key)} is required!`);
            isValid = false;
        } else {
            addSuccessClass(input);
        }
    }
    return isValid;
};

export const validateWithRegExp = (userInputObj) => {
    let isValid = true;
    for (const key in userInputObj) {
        const input = [...$INPUTS].find((i) => i.id === key);
        const validationRule = regExpValidation[key];
        if (
            validationRule &&
            !validationRule.pattern.test(userInputObj[key].trim())
        ) {
            addErrorClass(input, validationRule.error);
            isValid = false;
        } else {
            addSuccessClass(input);
        }
    }
    return isValid;
};

export const comparePasswords = (password, rePassword) => {
    const input = [...$INPUTS].find((i) => i.id === "rePassword");
    if (password.trim() === "" || rePassword.trim() === "") {
        return false;
    }
    if (password !== rePassword) {
        addErrorClass(input, "Passwords do not match!");
        return false;
    } else {
        addSuccessClass(input);
    }
    return true;
};
