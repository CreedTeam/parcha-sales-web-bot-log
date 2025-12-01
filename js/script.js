"use strict";

const form = document.querySelector("form");
const inpName = document.querySelector("#inpName");
const inpOrg = document.querySelector("#inpOrg");
const tel = document.querySelector("#telephone");
const inpAdr = document.querySelector("#inpAdr");
const orgSelect = document.querySelector("#orgSelect");
const btn = document.querySelector(".btn");


const statusBox = document.createElement("div");
statusBox.className = "statusBox";
form.appendChild(statusBox);


async function loadOrganizationsSelect() {
    orgSelect.innerHTML = '<option value="">Загрузка партнёров...</option>';

    try {
        const res = await fetch("https://d1f78273c152.ngrok-free.app/orgs/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "list" })
        });

        if (!res.ok) {
            orgSelect.innerHTML = `<option value="">Ошибка сервера: ${res.status}</option>`;
            showStatus("Ошибка связи с сервером", "error");
            return;
        }

        const data = await res.json();
        console.log("Ответ от /orgs/:", data);

        
        orgSelect.innerHTML = '<option value="">Выберите партнёра</option>';

        if (!Array.isArray(data) || data.length === 0) {
            orgSelect.innerHTML = '<option value="">Нет партнёра</option>';
            return;
        }

        
        data.forEach(item => {
            if (item.org && item.name) {
                const opt = document.createElement("option");
                opt.value = item.name.trim();           
                opt.textContent = item.org.trim();      
                orgSelect.appendChild(opt);
            }
        });

        if (orgSelect.options.length === 1) {
            orgSelect.innerHTML = '<option value="">Партнёр есть, но нет полей org/name</option>';
        }

    } catch (err) {
        console.error("Ошибка загрузки партнёров:", err);
        orgSelect.innerHTML = '<option value="">Нет связи с сервером</option>';
        showStatus("Нет интернета или сервер упал", "error");
    }
}

loadOrganizationsSelect();


form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = inpName.value.trim();
    const fromOrg = inpOrg.value.trim();
    const toOrg = orgSelect.value.trim();   
    const phone = tel.value.trim();
    const address = inpAdr.value.trim();

    if (!toOrg) {
        showStatus("Выберите организацию назначения!", "error");
        return;
    }

    btn.disabled = true;
    btn.textContent = "Отправка...";
    showStatus("Отправляем заявку...", "loading");

    showStatus("Отправляем заявку...", "loading");

    try {
        const res = await fetch("https://d1f78273c152.ngrok-free.app/report/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                fromOrganization: fromOrg,
                toOrganization: toOrg,      
                phone,
                address
            })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `Ошибка ${res.status}`);
        }

        showStatus("Заявка успешно отправлена!", "success");
        form.reset();
        orgSelect.selectedIndex = 0;

    } catch (err) {
        console.error("Ошибка отправки:", err);
        showStatus(err.message || "Не удалось отправить заявку", "error");
    } finally {
        btn.disabled = false;
        btn.textContent = "Отправить";
    }
});


function showStatus(message, type = "info") {
    statusBox.textContent = message;
    statusBox.textContent = message;
    statusBox.className = `statusBox ${type}`;

    if (type !== "loading") {
        clearTimeout(statusBox.timer);
        statusBox.timer = setTimeout(() => {
            statusBox.textContent = "";
            statusBox.className = "statusBox";
        }, 5000);
    }
}

