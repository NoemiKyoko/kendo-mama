// ─────────────────────────────
// ELEMENTI DELLA PAGINA
// ─────────────────────────────

const welcome = document.getElementById('welcome');
const enterButton = document.getElementById('enter');
const dojo = document.getElementById('dojo');

const xpElement = document.getElementById('xp');

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


// ─────────────────────────────
// DATA DI OGGI
// Esempio: 2026-07-20
// ─────────────────────────────

const today =
  new Date().toLocaleDateString('en-CA');


// ─────────────────────────────
// DATI SALVATI
// ─────────────────────────────

let xp =
  Number(localStorage.getItem('kendoMamaXp')) || 0;

let selectedEnergy = null;
let selectedReward = 0;


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
// ARCHIVIO MISSIONI
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
// MOSTRA XP
// ─────────────────────────────

function updateXpDisplay() {
  xpElement.textContent = xp;
}


// ─────────────────────────────
// APRE IL DOJO
// ─────────────────────────────

function enterDojo() {
  welcome.classList.add('hidden');
  dojo.classList.remove('hidden');
}


// ─────────────────────────────
// SCEGLIE LA MISSIONE DEL GIORNO
// La missione resta uguale per tutta
// la giornata.
// ─────────────────────────────

function getDailyMission(energy) {
  const missionList = missions[energy];

  const dateNumber =
    Number(today.replaceAll('-', ''));

  const offsets = {
    low: 0,
    medium: 2,
    high: 4
  };

  const missionIndex =
    (dateNumber + offsets[energy])
    % missionList.length;

  return missionList[missionIndex];
}


// ─────────────────────────────
// MOSTRA LA MISSIONE
// ─────────────────────────────

function showMission(energy) {
  const data = energyData[energy];

  if (!data) {
    return;
  }

  selectedEnergy = energy;
  selectedReward = data.xp;

  const dailyMission =
    getDailyMission(energy);

  missionText.textContent =
    `${data.emoji} ${dailyMission} · ${data.minutes} minuti`;

  missionBox.classList.remove('hidden');

  resultBox.classList.add('hidden');
  resultBox.innerHTML = '';
}


// ─────────────────────────────
// EVIDENZIA UN PULSANTE
// ─────────────────────────────

function selectEnergyButton(selectedButton) {
  energyButtons.forEach(button => {
    button.classList.remove('selected');
  });

  selectedButton.classList.add('selected');
}


// ─────────────────────────────
// QUEST GIÀ COMPLETATA?
// ─────────────────────────────

function isQuestCompletedToday() {
  const completedDate =
    localStorage.getItem('kendoMamaCompletedDate');

  return completedDate === today;
}


// ─────────────────────────────
// BLOCCA LA QUEST FINO A DOMANI
// ─────────────────────────────

function lockQuest() {
  const savedEnergy =
    localStorage.getItem('kendoMamaCompletedEnergy');

  energyButtons.forEach(button => {
    button.disabled = true;
    button.classList.remove('selected');

    if (button.dataset.energy === savedEnergy) {
      button.classList.add('selected');
    }
  });

  if (savedEnergy && energyData[savedEnergy]) {
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

  resultBox.classList.remove('hidden');
}


// ─────────────────────────────
// COMPLETA LA QUEST
// ─────────────────────────────

function completeQuest() {
  if (!selectedEnergy || selectedReward === 0) {
    resultBox.textContent =
      'Prima scegli il tuo livello di energia 🌸';

    resultBox.classList.remove('hidden');

    return;
  }

  if (isQuestCompletedToday()) {
    lockQuest();
    return;
  }

  xp += selectedReward;

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

  updateXpDisplay();

  resultBox.innerHTML = `
    <strong>お疲れ様でした！</strong>
    Quest completata: +${selectedReward} XP 🌸<br>
    Hai fatto un passo. Oggi bastava quello.
  `;

  resultBox.classList.remove('hidden');

  lockQuest();
}


// ─────────────────────────────
// EVENTI
// ─────────────────────────────

enterButton.addEventListener(
  'click',
  enterDojo
);

energyButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (isQuestCompletedToday()) {
      return;
    }

    selectEnergyButton(button);

    const energy =
      button.dataset.energy;

    showMission(energy);
  });
});

completeButton.addEventListener(
  'click',
  completeQuest
);


// ─────────────────────────────
// AVVIO DELL'APP
// ─────────────────────────────

updateXpDisplay();

if (isQuestCompletedToday()) {
  lockQuest();
}
