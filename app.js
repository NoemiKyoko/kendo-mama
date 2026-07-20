// ─────────────────────────────
// ELEMENTI DELLA PAGINA
// ─────────────────────────────

const welcome =
  document.getElementById('welcome');

const enterButton =
  document.getElementById('enter');

const dojo =
  document.getElementById('dojo');

const xpElement =
  document.getElementById('xp');

const levelName =
  document.getElementById('levelName');

const welcomeLevel =
  document.getElementById('welcomeLevel');

const nextLevel =
  document.getElementById('nextLevel');

const noziAccessory =
  document.getElementById('noziAccessory');

const noziWink =
  document.getElementById('noziWink');

const energyButtons =
  document.querySelectorAll('.energy button');

const missionBox =
  document.getElementById('mission');

const missionText =
  document.getElementById('missionText');

const completeButton =
  document.getElementById('complete');

const resultBox =
  document.getElementById('result');

const weekCalendar =
  document.getElementById('weekCalendar');

const streakElement =
  document.getElementById('streak');

const badgesElement =
  document.getElementById('badges');

const badgeCountElement =
  document.getElementById('badgeCount');

const petalLayer =
  document.getElementById('petalLayer');


// ─────────────────────────────
// DATA
// ─────────────────────────────

function formatDate(date) {
  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1)
      .padStart(2, '0');

  const day =
    String(date.getDate())
      .padStart(2, '0');

  return `${year}-${month}-${day}`;
}


const today =
  formatDate(new Date());


// ─────────────────────────────
// DATI SALVATI
// ─────────────────────────────

let xp =
  Number(
    localStorage.getItem('kendoMamaXp')
  ) || 0;

let selectedEnergy = null;
let selectedReward = 0;

let completedDates =
  readCompletedDates();


// ─────────────────────────────
// MIGRAZIONE DEI DATI VECCHI
// Conserva la quest già completata
// nelle versioni precedenti.
// ─────────────────────────────

function readCompletedDates() {
  const saved =
    localStorage.getItem(
      'kendoMamaCompletedDates'
    );

  let dates = [];

  if (saved) {
    try {
      const parsed =
        JSON.parse(saved);

      if (Array.isArray(parsed)) {
        dates = parsed;
      }
    } catch (error) {
      dates = [];
    }
  }

  const oldCompletedDate =
    localStorage.getItem(
      'kendoMamaCompletedDate'
    );

  if (
    oldCompletedDate &&
    !dates.includes(oldCompletedDate)
  ) {
    dates.push(oldCompletedDate);
  }

  return [...new Set(dates)].sort();
}


function saveCompletedDates() {
  localStorage.setItem(
    'kendoMamaCompletedDates',
    JSON.stringify(completedDates)
  );
}


// ─────────────────────────────
// LIVELLI
// ─────────────────────────────

const levels = [
  {
    minimum: 0,
    name: 'Novizia',
    emoji: '🌱',
    accessory: '🌱'
  },

  {
    minimum: 50,
    name: 'Kōhai',
    emoji: '🍙',
    accessory: '🍙'
  },

  {
    minimum: 150,
    name: 'Senpai',
    emoji: '🌸',
    accessory: '🌸'
  },

  {
    minimum: 300,
    name: 'Kendō Mama',
    emoji: '🥋',
    accessory: '🥋'
  }
];


function getCurrentLevel() {
  let currentLevel =
    levels[0];

  levels.forEach(level => {
    if (xp >= level.minimum) {
      currentLevel = level;
    }
  });

  return currentLevel;
}


function getNextLevel() {
  return levels.find(
    level => level.minimum > xp
  );
}


function updateLevelDisplay() {
  const currentLevel =
    getCurrentLevel();

  const label =
    `${currentLevel.name} ${currentLevel.emoji}`;

  levelName.textContent =
    label;

  welcomeLevel.textContent =
    label;

  noziAccessory.textContent =
    currentLevel.accessory;

  const upcomingLevel =
    getNextLevel();

  if (upcomingLevel) {
    const missingXp =
      upcomingLevel.minimum - xp;

    nextLevel.textContent =
      `${missingXp} XP al grado ${upcomingLevel.name}`;
  } else {
    nextLevel.textContent =
      'Grado massimo raggiunto ✨';
  }
}


// ─────────────────────────────
// LIVELLI DI ENERGIA
// ─────────────────────────────

const energyData = {
  low: {
    minutes: 4,
    xp: 10,
    emoji: '🌱'
  },

  medium: {
    minutes: 9,
    xp: 20,
    emoji: '🌸'
  },

  high: {
    minutes: 15,
    xp: 30,
    emoji: '⚔️'
  }
};


// ─────────────────────────────
// MISSIONI
// ─────────────────────────────

const missions = {
  low: [
    'Sciogli delicatamente collo e spalle',
    'Respira lentamente e rilassa il corpo',
    'Esegui alcuni movimenti dolci delle braccia',
    'Fai una breve pausa di mobilità consapevole',
    'Allunga delicatamente schiena e gambe',
    'Cammina lentamente concentrandoti sul respiro',
    'Dedica qualche minuto al rilassamento'
  ],

  medium: [
    'Esegui una breve sessione di stretching',
    'Alterna mobilità dolce e respirazione',
    'Fai una camminata tranquilla e consapevole',
    'Mobilizza spalle, schiena e bacino',
    'Esegui una sequenza lenta di allungamento',
    'Combina respirazione e movimenti controllati',
    'Dedica qualche minuto alla postura'
  ],

  high: [
    'Esegui una breve sessione di suburi controllati',
    'Combina mobilità, stretching e respirazione',
    'Esegui una sequenza completa di movimenti dolci',
    'Alterna camminata, mobilità e rilassamento',
    'Lavora su postura, equilibrio e respirazione',
    'Esegui suburi lenti mantenendo il controllo',
    'Dedica una sessione completa al movimento'
  ]
};


// ─────────────────────────────
// BADGE
// ─────────────────────────────

const badgeData = [
  {
    icon: '🌱',
    title: 'Primo passo',
    description: 'Completa la prima quest',
    unlocked: () =>
      completedDates.length >= 1
  },

  {
    icon: '🔥',
    title: 'Tre giorni',
    description: 'Raggiungi una serie di 3 giorni',
    unlocked: () =>
      calculateStreak() >= 3
  },

  {
    icon: '🌸',
    title: 'Sette giorni',
    description: 'Raggiungi una serie di 7 giorni',
    unlocked: () =>
      calculateStreak() >= 7
  },

  {
    icon: '🍙',
    title: 'Kōhai',
    description: 'Raggiungi 50 XP',
    unlocked: () =>
      xp >= 50
  },

  {
    icon: '✨',
    title: 'Cento XP',
    description: 'Raggiungi 100 XP',
    unlocked: () =>
      xp >= 100
  },

  {
    icon: '🥋',
    title: 'Kendō Mama',
    description: 'Raggiungi 300 XP',
    unlocked: () =>
      xp >= 300
  }
];


// ─────────────────────────────
// AGGIORNAMENTO XP
// ─────────────────────────────

function updateXpDisplay() {
  xpElement.textContent =
    xp;

  updateLevelDisplay();
}


// ─────────────────────────────
// APERTURA DOJO
// ─────────────────────────────

function enterDojo() {
  welcome.classList.add('hidden');
  dojo.classList.remove('hidden');
}


// ─────────────────────────────
// MISSIONE DEL GIORNO
// ─────────────────────────────

function getDailyMission(energy) {
  const missionList =
    missions[energy];

  const dateNumber =
    Number(
      today.replaceAll('-', '')
    );

  const offsets = {
    low: 0,
    medium: 2,
    high: 4
  };

  const missionIndex =
    (
      dateNumber +
      offsets[energy]
    ) % missionList.length;

  return missionList[missionIndex];
}


function showMission(energy) {
  const data =
    energyData[energy];

  if (!data) {
    return;
  }

  selectedEnergy =
    energy;

  selectedReward =
    data.xp;

  const dailyMission =
    getDailyMission(energy);

  missionText.textContent =
    `${data.emoji} ${dailyMission} · ${data.minutes} minuti`;

  missionBox.classList.remove(
    'hidden'
  );

  if (!isQuestCompletedToday()) {
    resultBox.classList.add(
      'hidden'
    );

    resultBox.innerHTML = '';
  }
}


// ─────────────────────────────
// SCELTA ENERGIA
// ─────────────────────────────

function selectEnergyButton(
  selectedButton
) {
  energyButtons.forEach(button => {
    button.classList.remove(
      'selected'
    );
  });

  selectedButton.classList.add(
    'selected'
  );
}


// ─────────────────────────────
// QUEST COMPLETATA?
// ─────────────────────────────

function isQuestCompletedToday() {
  return completedDates.includes(
    today
  );
}


// ─────────────────────────────
// BLOCCO FINO A DOMANI
// ─────────────────────────────

function lockQuest() {
  const savedEnergy =
    localStorage.getItem(
      'kendoMamaCompletedEnergy'
    );

  energyButtons.forEach(button => {
    button.disabled = true;

    button.classList.remove(
      'selected'
    );

    if (
      button.dataset.energy ===
      savedEnergy
    ) {
      button.classList.add(
        'selected'
      );
    }
  });

  if (
    savedEnergy &&
    energyData[savedEnergy]
  ) {
    showMission(savedEnergy);
  }

  completeButton.disabled = true;

  completeButton.textContent =
    'Quest completata ✓';

  resultBox.innerHTML = `
    <strong>お疲れ様でした！</strong>
    Oggi hai già completato la tua quest.<br>
    Torna domani 🌸
  `;

  resultBox.classList.remove(
    'hidden'
  );
}


// ─────────────────────────────
// COMPLETAMENTO QUEST
// ─────────────────────────────

function completeQuest() {
  if (
    !selectedEnergy ||
    selectedReward === 0
  ) {
    resultBox.textContent =
      'Prima scegli il tuo livello di energia 🌸';

    resultBox.classList.remove(
      'hidden'
    );

    return;
  }

  if (isQuestCompletedToday()) {
    lockQuest();
    return;
  }

  xp += selectedReward;

  completedDates.push(today);

  completedDates =
    [...new Set(completedDates)]
      .sort();

  localStorage.setItem(
    'kendoMamaXp',
    String(xp)
  );

  localStorage.setItem(
    'kendoMamaCompletedDate',
    today
  );

  localStorage.setItem(
    'kendoMamaCompletedEnergy',
    selectedEnergy
  );

  saveCompletedDates();

  updateXpDisplay();
  renderCalendar();
  renderBadges();

  resultBox.innerHTML = `
    <strong>お疲れ様でした！</strong>
    Quest completata: +${selectedReward} XP 🌸<br>
    Hai fatto un passo. Oggi bastava quello.
  `;

  resultBox.classList.remove(
    'hidden'
  );

  celebrateWithPetals();
  lockQuest();
}


// ─────────────────────────────
// CALENDARIO
// ─────────────────────────────

function getLastSevenDays() {
  const days = [];

  for (
    let difference = 6;
    difference >= 0;
    difference -= 1
  ) {
    const date =
      new Date();

    date.setHours(
      12,
      0,
      0,
      0
    );

    date.setDate(
      date.getDate() -
      difference
    );

    days.push(date);
  }

  return days;
}


function renderCalendar() {
  const dayNames = [
    'Dom',
    'Lun',
    'Mar',
    'Mer',
    'Gio',
    'Ven',
    'Sab'
  ];

  weekCalendar.innerHTML = '';

  getLastSevenDays()
    .forEach(date => {
      const dateKey =
        formatDate(date);

      const completed =
        completedDates.includes(
          dateKey
        );

      const dayCard =
        document.createElement('div');

      dayCard.className =
        'day-card';

      if (dateKey === today) {
        dayCard.classList.add(
          'today'
        );
      }

      dayCard.innerHTML = `
        <span class="day-name">
          ${dayNames[date.getDay()]}
        </span>

        <span class="day-number">
          ${date.getDate()}
        </span>

        <span class="day-status">
          ${completed ? '🌸' : '○'}
        </span>
      `;

      weekCalendar.appendChild(
        dayCard
      );
    });

  streakElement.textContent =
    calculateStreak();
}


// ─────────────────────────────
// SERIE DI GIORNI
// ─────────────────────────────

function calculateStreak() {
  let streak = 0;

  const checkDate =
    new Date();

  checkDate.setHours(
    12,
    0,
    0,
    0
  );

  if (!isQuestCompletedToday()) {
    checkDate.setDate(
      checkDate.getDate() - 1
    );
  }

  while (true) {
    const dateKey =
      formatDate(checkDate);

    if (
      !completedDates.includes(
        dateKey
      )
    ) {
      break;
    }

    streak += 1;

    checkDate.setDate(
      checkDate.getDate() - 1
    );
  }

  return streak;
}


// ─────────────────────────────
// BADGE
// ─────────────────────────────

function renderBadges() {
  badgesElement.innerHTML = '';

  let unlockedCount = 0;

  badgeData.forEach(badge => {
    const isUnlocked =
      badge.unlocked();

    if (isUnlocked) {
      unlockedCount += 1;
    }

    const badgeElement =
      document.createElement('div');

    badgeElement.className =
      `badge ${
        isUnlocked
          ? 'unlocked'
          : 'locked'
      }`;

    badgeElement.innerHTML = `
      <div class="badge-icon">
        ${isUnlocked ? badge.icon : '🔒'}
      </div>

      <div class="badge-title">
        ${badge.title}
      </div>

      <div class="badge-description">
        ${badge.description}
      </div>
    `;

    badgesElement.appendChild(
      badgeElement
    );
  });

  badgeCountElement.textContent =
    unlockedCount;
}


// ─────────────────────────────
// PETALI
// ─────────────────────────────

function celebrateWithPetals() {
  const petalCount = 14;

  for (
    let index = 0;
    index < petalCount;
    index += 1
  ) {
    const petal =
      document.createElement('span');

    petal.className =
      'falling-petal';

    petal.textContent =
      index % 3 === 0
        ? '🌺'
        : '🌸';

    petal.style.left =
      `${Math.random() * 100}%`;

    petal.style.setProperty(
      '--duration',
      `${2.8 + Math.random() * 2}s`
    );

    petal.style.setProperty(
      '--drift',
      `${-90 + Math.random() * 180}px`
    );

    petal.style.animationDelay =
      `${Math.random() * 0.8}s`;

    petalLayer.appendChild(
      petal
    );

    window.setTimeout(
      () => {
        petal.remove();
      },
      6000
    );
  }
}


// ─────────────────────────────
// OCCHIOLINO DI NOZI
// ─────────────────────────────

function showNoziWink() {
  if (
    noziWink.classList.contains(
      'show'
    )
  ) {
    return;
  }

  noziWink.classList.add(
    'show'
  );

  window.setTimeout(
    () => {
      noziWink.classList.remove(
        'show'
      );
    },
    1600
  );
}


function scheduleNoziWink() {
  const delay =
    9000 +
    Math.random() * 7000;

  window.setTimeout(
    () => {
      showNoziWink();
      scheduleNoziWink();
    },
    delay
  );
}


// ─────────────────────────────
// EVENTI
// ─────────────────────────────

enterButton.addEventListener(
  'click',
  enterDojo
);


energyButtons.forEach(button => {
  button.addEventListener(
    'click',
    () => {
      if (
        isQuestCompletedToday()
      ) {
        return;
      }

      selectEnergyButton(
        button
      );

      showMission(
        button.dataset.energy
      );
    }
  );
});


completeButton.addEventListener(
  'click',
  completeQuest
);


// ─────────────────────────────
// AVVIO
// ─────────────────────────────

updateXpDisplay();
renderCalendar();
renderBadges();
scheduleNoziWink();

if (isQuestCompletedToday()) {
  lockQuest();
}
