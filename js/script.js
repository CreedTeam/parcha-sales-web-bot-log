"use strict";
const doc = document;

let form = doc.querySelector("form");

let inpName = doc.querySelector("#inpName");
let inpOrg = doc.querySelector("#inpOrg");
let inpAdr = doc.querySelector("#inpAdr");
let tel = doc.querySelector("#telephone");

let btn = doc.querySelector(".btn");


let statusBox = document.createElement("div");
statusBox.className = "statusBox";
form.appendChild(statusBox);

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let name = inpName.value.trim();
    let organization = inpOrg.value.trim();
    let phone = tel.value.trim();
    let address = inpAdr.value.trim();

    
    btn.disabled = true;
    btn.textContent = "Отправка...";

    showStatus("Отправляем данные...", "loading");

    try {
        let res = await fetch("https://247e8a799ce7.ngrok-free.app/report/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                organization,
                phone,
                address
            }),
        });

        let data = await res.json();

        if (res.ok) {
            showStatus("Успешно отправлено!", "success");
            form.reset(); 
        } else {
            showStatus("Ошибка сервера!", "error");
        }

    } catch (err) {
        showStatus("Сеть недоступна!", "error");
        console.log(err);
    }

    
    btn.disabled = false;
    btn.textContent = "Отправить";
});


function showStatus(message, type) {
    statusBox.textContent = message;
    statusBox.className = `statusBox ${type}`;
}
