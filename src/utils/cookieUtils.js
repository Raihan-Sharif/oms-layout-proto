// src/utils/cookieUtils.js
export const setCookie = (name, value, days = 7) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`;
  };
  
  export const getCookie = (name) => {
    const cookieName = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        return JSON.parse(cookie.substring(cookieName.length));
      }
    }
    return null;
  };