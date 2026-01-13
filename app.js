// ===== НАСТРОЙКИ =====
const alarmToggle = document.getElementById("alarmToggle");

// ===== СОХРАНЕНИЕ БУДИЛЬНИКА =====
alarmToggle.checked = localStorage.getItem("alarm") === "on";

alarmToggle.onchange = () => {
  localStorage.setItem("alarm", alarmToggle.checked ? "on" : "off");
};

// ===== ПОЛУЧЕНИЕ ТЕКСТА (БЕЗ ИИ) =====
async function generateLecture(topic) {
  const url = `https://ru.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    return `
      Тема: ${topic}.
      ${data.extract}
      Повторим главное.
      ${data.extract}
    `;
  } catch {
    return "Не удалось загрузить тему.";
  }
}

// ===== ОЗВУЧКА =====
function speak(text, minutes) {
  speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ru-RU";
  utter.rate = 0.85;
  utter.volume = 1;

  speechSynthesis.speak(utter);
  fadeOut(utter, minutes);
}

// ===== ПЛАВНОЕ ЗАТУХАНИЕ =====
function fadeOut(utter, minutes) {
  const steps = minutes * 2;
  let step = 0;

  const interval = setInterval(() => {
    step++;
    utter.volume = Math.max(0, 1 - step / steps);

    if (utter.volume <= 0) {
      speechSynthesis.cancel();
      clearInterval(interval);
    }
  }, 30000);
}

// ===== ПЕРЕД СНОМ =====
async function startSleep() {
  const topic = document.getElementById("topic").value;
  const minutes = Number(document.getElementById("duration").value);

  if (!topic) {
    alert("Введите тему");
    return;
  }

  const text = await generateLecture(topic);
  speak(text, minutes);

  // Android будильник
  if (/Android/i.test(navigator.userAgent) && localStorage.getItem("alarm") === "on") {
    setTimeout(() => {
      setAndroidAlarm(7, 0); // можно улучшить позже
    }, 1000);
  }
}

// ===== УТРО =====
function startMorning() {
  const topic = document.getElementById("topic").value;
  speak(`Кратко повторим тему ${topic}`, 5);
}

// ===== ANDROID БУДИЛЬНИК =====
function setAndroidAlarm(hour, minute) {
  window.location.href =
    `intent://alarm#set?hour=${hour}&minutes=${minute}#Intent;scheme=android.intent.action;end`;
}
