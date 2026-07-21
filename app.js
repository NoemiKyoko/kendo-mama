"use strict";

// ─────────────────────────────
// ELEMENTI DELLA PAGINA
// ─────────────────────────────

const $ = id => document.getElementById(id);

const el = {
  enter: $("enter"),
  welcome: $("welcome"),
  dojo: $("dojo"),
  homeButton: $("homeButton"),

  noziImage: $("noziImage"),
  noziFallback: $("noziFallback"),
  winkBubble: $("winkBubble"),
  accessory: $("accessory"),
  welcomeMessage: $("welcomeMessage"),

  xp: $("xp"),
  streak: $("streak"),
  levelName: $("levelName"),
  levelIcon: $("levelIcon"),

  mission: $("mission"),
  noziMessage: $("noziMessage"),
  videoTitle: $("videoTitle"),
  videoNote: $("videoNote"),
  videoDuration: $("videoDuration"),
  videoChannel: $("videoChannel"),
  rewardText: $("rewardText"),
  missionEnergyIcon: $("missionEnergyIcon"),

  startTraining: $("startTraining"),
  changeTraining: $("changeTraining"),

  videoArea: $("videoArea"),
  videoFrame: $("videoFrame"),
  youtubeLink: $("youtubeLink"),

  timerText: $("timerText"),
  timerIcon: $("timerIcon"),

  complete: $("complete"),
  result: $("result"),

  calendar: $("calendar"),
  badges: $("badges"),
  petalLayer: $("petalLayer")
};


// ─────────────────────────────
// CHIAVI PER I DATI SALVATI
// ─────────────────────────────

const KEYS = {
  xp: "kendoMamaXp",
  completed: "kendoMamaCompletedDates",
  choices: "kendoMamaDailyVideoChoices"
};


// ─────────────────────────────
// STATO DELL’APP
// ─────────────────────────────

let state = {
  xp: readNumber(KEYS.xp, 0),
  completed: readArray(KEYS.completed),
  choices: readObject(KEYS.choices),

  energy: null,
  video: null,
  reward: 0,

  started: false,
  seconds: 0,
  timer: null
};


// ─────────────────────────────
// LIVELLI DI ENERGIA
// ─────────────────────────────

const energy = {
  low: {
    icon: "🌱",
    reward: 5,
    messages: [
      "Oggi andiamo piano. Anche poco conta.",
      "Il dojo ti accoglie nelle giornate lente."
    ]
  },

  medium: {
    icon: "🌸",
    reward: 10,
    messages: [
      "Troviamo un ritmo gentile e continuo.",
      "Un movimento alla volta: costruiamo costanza."
    ]
  },

  high: {
    icon: "⚔️",
    reward: 15,
    messages: [
      "Energia alta, ascolto ancora più alto.",
      "La forza è anche sapere quando rallentare."
    ]
  }
};


// ─────────────────────────────
// LIVELLI DEL DOJO
// ─────────────────────────────

const levels = [
  {
    min: 0,
    name: "Novizio",
    icon: "🌱",
    accessory: "🌱"
  },
  {
    min: 30,
    name: "Kōhai",
    icon: "🍙",
    accessory: "🎀"
  },
  {
    min: 80,
    name: "Senpai",
    icon: "🌸",
    accessory: "🌸"
  },
  {
    min: 160,
    name: "Kendō Mama",
    icon: "🥋",
    accessory: "🥋"
  }
];


// ─────────────────────────────
// BADGE
// ─────────────────────────────

const badgeDefs = [
  {
    icon: "🌱",
    name: "Primo passo",
    text: "Completa la prima quest.",
    ok: () => state.completed.length >= 1
  },
  {
    icon: "🍙",
    name: "Costanza gentile",
    text: "Completa tre quest.",
    ok: () => state.completed.length >= 3
  },
  {
    icon: "🌸",
    name: "Sette petali",
    text: "Completa sette quest.",
    ok: () => state.completed.length >= 7
  },
  {
    icon: "🔥",
    name: "Tre giorni sul tatami",
    text: "Raggiungi una serie di tre giorni.",
    ok: () => streak() >= 3
  },
  {
    icon: "✨",
    name: "Spirito luminoso",
    text: "Raggiungi 50 XP.",
    ok: () => state.xp >= 50
  },
  {
    icon: "🥋",
    name: "Kendō Mama",
    text: "Raggiungi il livello finale.",
    ok: () => state.xp >= 160
  }
];


// ─────────────────────────────
// AVVIO
// ─────────────────────────────

init();

function init() {
  setupNozi();
  setupEvents();
  updateWelcome();
  updateProgress();
  scheduleWink();
}


// ─────────────────────────────
// NOZI
// ─────────────────────────────

function setupNozi() {
  const fallback = () => {
    el.noziImage.classList.add("hidden");
    el.noziFallback.classList.remove("hidden");
  };

  el.noziImage.addEventListener("error", fallback);

  if (
    el.noziImage.complete &&
    el.noziImage.naturalWidth === 0
  ) {
    fallback();
  }
}


// ─────────────────────────────
// PULSANTI ED EVENTI
// ─────────────────────────────

function setupEvents() {
  el.enter.addEventListener("click", () => {
    el.welcome.classList.add("hidden");
    el.dojo.classList.remove("hidden");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  el.homeButton.addEventListener("click", () => {
    stopTimer();
    el.videoFrame.src = "";

    el.dojo.classList.add("hidden");
    el.welcome.classList.remove("hidden");
  });

  document
    .querySelectorAll(".energy button")
    .forEach(button => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll(".energy button")
          .forEach(b => b.classList.remove("selected"));

        button.classList.add("selected");
        chooseEnergy(button.dataset.energy);
      });
    });

  el.startTraining.addEventListener(
    "click",
    beginTraining
  );

  el.changeTraining.addEventListener(
    "click",
    nextVideo
  );

  el.complete.addEventListener(
    "click",
    completeQuest
  );
}


// ─────────────────────────────
// SCELTA DELL’ENERGIA
// ─────────────────────────────

function chooseEnergy(kind) {
  if (!videoLibrary[kind]) {
    return;
  }

  state.energy = kind;
  state.reward = energy[kind].reward;
  state.video = dailyVideo(kind);
  state.started = false;

  resetMission();
  renderMission();

  el.mission.classList.remove("hidden");

  setTimeout(() => {
    el.mission.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 100);
}


// ─────────────────────────────
// VIDEO DEL GIORNO
// ─────────────────────────────

function dailyVideo(kind) {
  const key = `${dateKey(new Date())}-${kind}`;
  const list = videoLibrary[kind];

  const saved = list.find(
    video => video.id === state.choices[key]
  );

  if (saved) {
    return saved;
  }

  const selected = list[hash(key) % list.length];

  state.choices[key] = selected.id;
  save(KEYS.choices, state.choices);

  return selected;
}


// ─────────────────────────────
// CAMBIO VIDEO
// ─────────────────────────────

function nextVideo() {
  if (!state.energy || !state.video) {
    return;
  }

  const list = videoLibrary[state.energy];

  const index = list.findIndex(
    video => video.id === state.video.id
  );

  state.video = list[(index + 1) % list.length];

  const key =
    `${dateKey(new Date())}-${state.energy}`;

  state.choices[key] = state.video.id;
  save(KEYS.choices, state.choices);

  state.started = false;

  resetMission();
  renderMission();
}


// ─────────────────────────────
// MOSTRA LA MISSIONE
// ─────────────────────────────

function renderMission() {
  const cfg = energy[state.energy];

  el.videoTitle.textContent =
    state.video.title;

  el.videoNote.textContent =
    state.video.note;

  el.videoDuration.textContent =
    `${state.video.duration} minuti`;

  el.videoChannel.textContent =
    state.video.channel;

  el.rewardText.textContent =
    `+${state.reward} XP`;

  el.missionEnergyIcon.textContent =
    cfg.icon;

  el.noziMessage.textContent =
    random(cfg.messages);

  el.youtubeLink.href =
    `https://www.youtube.com/watch?v=${state.video.id}`;

  el.result.classList.add("hidden");

  syncCompletionButton();
}


// ─────────────────────────────
// RESET DELLA MISSIONE
// ─────────────────────────────

function resetMission() {
  stopTimer();

  state.seconds = 0;

  el.videoArea.classList.add("hidden");
  el.complete.classList.add("hidden");

  el.startTraining.disabled = false;
  el.startTraining.textContent =
    "▶️ Inizia allenamento";

  el.timerText.textContent =
    "Video non ancora avviato";

  el.timerIcon.textContent = "⏱️";
  el.videoFrame.src = "";
}


// ─────────────────────────────
// AVVIO DELL’ALLENAMENTO
// ─────────────────────────────

function beginTraining() {
  if (!state.video) {
    return;
  }

  state.started = true;

  el.videoFrame.src =
    `https://www.youtube-nocookie.com/embed/${state.video.id}?autoplay=1&rel=0`;

  el.videoArea.classList.remove("hidden");
  el.complete.classList.remove("hidden");

  el.startTraining.disabled = true;
  el.startTraining.textContent =
    "Allenamento avviato 🌸";

  el.timerIcon.textContent = "🥋";

  startTimer();
  syncCompletionButton();
}


// ─────────────────────────────
// COMPLETAMENTO DELLA QUEST
// ─────────────────────────────

function completeQuest() {
  if (!state.started || !state.video) {
    return;
  }

  const today = dateKey(new Date());

  if (state.completed.includes(today)) {
    el.result.textContent =
      "La quest di oggi è già registrata. Puoi comunque ripetere l’allenamento. 🌸";

    el.result.classList.remove("hidden");

    syncCompletionButton();
    return;
  }

  state.xp += state.reward;

  state.completed = [
    ...new Set([
      ...state.completed,
      today
    ])
  ].sort();

  localStorage.setItem(
    KEYS.xp,
    String(state.xp)
  );

  save(
    KEYS.completed,
    state.completed
  );

  stopTimer();
  updateProgress();
  updateWelcome();
  petals();

  el.result.innerHTML =
    `Quest completata! Hai guadagnato <strong>${state.reward} XP</strong>.<br>Nozi è fiera di te. 🍙🌸`;

  el.result.classList.remove("hidden");

  syncCompletionButton();
}


// ─────────────────────────────
// PULSANTE QUEST COMPLETATA
// ─────────────────────────────

function syncCompletionButton() {
  if (!state.energy) {
    return;
  }

  const done = state.completed.includes(
    dateKey(new Date())
  );

  el.complete.disabled = done;

  el.complete.textContent =
    done
      ? "Quest già registrata ✓"
      : "Quest completata";
}


// ─────────────────────────────
// AGGIORNAMENTO XP, LIVELLI E BADGE
// ─────────────────────────────

function updateProgress() {
  el.xp.textContent = state.xp;
  el.streak.textContent = streak();

  const level =
    [...levels]
      .reverse()
      .find(item => state.xp >= item.min)
    || levels[0];

  el.levelName.textContent =
    level.name;

  el.levelIcon.textContent =
    level.icon;

  el.accessory.textContent =
    level.accessory;

  renderCalendar();
  renderBadges();
  syncCompletionButton();
}


// ─────────────────────────────
// MESSAGGIO FISSO DEL DOJO
// ─────────────────────────────

function updateWelcome() {
  el.welcomeMessage.innerHTML =
    "Cerca di essere te stessa.<br>In questo dojo puoi fare le cose con calma.";
}


// ─────────────────────────────
// CALENDARIO DEGLI ULTIMI 7 GIORNI
// ─────────────────────────────

function renderCalendar() {
  el.calendar.innerHTML = "";

  const names = [
    "Dom",
    "Lun",
    "Mar",
    "Mer",
    "Gio",
    "Ven",
    "Sab"
  ];

  const today = new Date();
  const todayKey = dateKey(today);

  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(today);

    date.setHours(12, 0, 0, 0);
    date.setDate(today.getDate() - offset);

    const key = dateKey(date);

    const day =
      document.createElement("div");

    day.className = "calendar-day";

    if (state.completed.includes(key)) {
      day.classList.add("completed");
    }

    if (key === todayKey) {
      day.classList.add("today");
    }

    day.innerHTML = `
      <span class="calendar-name">
        ${names[date.getDay()]}
      </span>

      <strong>
        ${date.getDate()}
      </strong>

      <span>
        ${state.completed.includes(key) ? "🌸" : "·"}
      </span>
    `;

    el.calendar.appendChild(day);
  }
}


// ─────────────────────────────
// BADGE
// ─────────────────────────────

function renderBadges() {
  el.badges.innerHTML = "";

  badgeDefs.forEach(badge => {
    const unlocked = badge.ok();

    const card =
      document.createElement("div");

    card.className =
      `badge${unlocked ? "" : " locked"}`;

    card.innerHTML = `
      <span class="badge-icon">
        ${unlocked ? badge.icon : "🔒"}
      </span>

      <div>
        <strong>${badge.name}</strong>
        <br>
        <small>${badge.text}</small>
      </div>
    `;

    el.badges.appendChild(card);
  });
}


// ─────────────────────────────
// SERIE DI GIORNI CONSECUTIVI
// ─────────────────────────────

function streak() {
  if (!state.completed.length) {
    return 0;
  }

  const completedSet =
    new Set(state.completed);

  const today = new Date();

  today.setHours(12, 0, 0, 0);

  let cursor;

  if (completedSet.has(dateKey(today))) {
    cursor = new Date(today);
  } else {
    today.setDate(today.getDate() - 1);
    cursor = new Date(today);
  }

  if (!completedSet.has(dateKey(cursor))) {
    return 0;
  }

  let count = 0;

  while (completedSet.has(dateKey(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return count;
}


// ─────────────────────────────
// TIMER
// ─────────────────────────────

function startTimer() {
  stopTimer();

  state.seconds = 0;
  updateTimer();

  state.timer = setInterval(() => {
    state.seconds++;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  if (state.timer !== null) {
    clearInterval(state.timer);
    state.timer = null;
  }
}

function updateTimer() {
  const minutes =
    Math.floor(state.seconds / 60);

  const seconds =
    String(state.seconds % 60)
      .padStart(2, "0");

  el.timerText.textContent =
    `In corso • ${minutes}:${seconds}`;
}


// ─────────────────────────────
// PIOGGIA DI PETALI
// ─────────────────────────────

function petals() {
  for (let i = 0; i < 24; i++) {
    const petal =
      document.createElement("span");

    petal.className = "petal";

    petal.textContent =
      random([
        "🌸",
        "🌸",
        "✨"
      ]);

    petal.style.left =
      `${rand(0, 100)}vw`;

    petal.style.setProperty(
      "--drift",
      `${rand(-100, 100)}px`
    );

    petal.style.animationDuration =
      `${rand(2800, 4800)}ms`;

    petal.style.animationDelay =
      `${rand(0, 900)}ms`;

    el.petalLayer.appendChild(petal);

    setTimeout(() => {
      petal.remove();
    }, 6000);
  }
}


// ─────────────────────────────
// STELLINA DI NOZI
// ─────────────────────────────

function scheduleWink() {
  setTimeout(() => {
    el.winkBubble.classList.remove("show");

    void el.winkBubble.offsetWidth;

    el.winkBubble.classList.add("show");

    scheduleWink();
  }, rand(9000, 16000));
}


// ─────────────────────────────
// FUNZIONI DI SUPPORTO
// ─────────────────────────────

function dateKey(date) {
  const year = date.getFullYear();

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(date.getDate())
      .padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function random(items) {
  return items[
    Math.floor(Math.random() * items.length)
  ];
}

function rand(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function hash(value) {
  let result = 0;

  for (let i = 0; i < value.length; i++) {
    result =
      ((result << 5) - result)
      + value.charCodeAt(i);

    result |= 0;
  }

  return Math.abs(result);
}


// ─────────────────────────────
// LETTURA DEI DATI SALVATI
// ─────────────────────────────

function readNumber(key, fallback) {
  const number =
    Number(localStorage.getItem(key));

  return Number.isFinite(number)
    ? number
    : fallback;
}

function readArray(key) {
  try {
    const value =
      JSON.parse(localStorage.getItem(key));

    return Array.isArray(value)
      ? value
      : [];
  } catch {
    return [];
  }
}

function readObject(key) {
  try {
    const value =
      JSON.parse(localStorage.getItem(key));

    return (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    )
      ? value
      : {};
  } catch {
    return {};
  }
}

function save(key, value) {
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}
