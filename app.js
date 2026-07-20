// ─────────────────────────────
// ELEMENTI DELLA PAGINA
// ─────────────────────────────

const enter = document.getElementById('enter');
const welcome = document.getElementById('welcome');
const dojo = document.getElementById('dojo');

const xpEl = document.getElementById('xp');
const mission = document.getElementById('mission');
const missionText = document.getElementById('missionText');
const complete = document.getElementById('complete');
const result = document.getElementById('result');


// ─────────────────────────────
// DATA DI OGGI
// Formato esempio: 2026-07-20
// ─────────────────────────────

const today = new Date().toLocaleDateString('en-CA');


// ─────────────────────────────
// XP SALVATI
// ─────────────────────────────

let xp = Number(localStorage.getItem('kendoMamaXp') || 0);
let reward = 0;
let selectedEnergy = '';

if (xpEl) {
  xpEl.textContent = xp;
}


// ─────────────────────────────
// INGRESSO NEL DOJO
// Funziona anche se la schermata
// iniziale è stata eliminata.
// ─────────────────────────────

if (enter && welcome && dojo) {
  enter.addEventListener('click', () => {
    welcome.classList.add('hidden');
    dojo.classList.remove('hidden');
  });
}


// ─────────────────────────────
// ARCHIVIO DELLE MISSIONI
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
// SCELTA DELLA MISSIONE DEL GIORNO
//
// La missione cambia in base alla data,
// ma resta uguale per tutta la giornata.
// ─────────────────────────────

function getDailyMission(energy) {
  const missionList = missions[energy];

  const dateNumber = Number(
    today.replaceAll('-', '')
  );

  let energyOffset = 0;

  if (energy === 'medium') {
    energyOffset = 2;
  }

  if (energy === 'high') {
    energyOffset = 4;
  }

  const missionIndex =
    (dateNumber + energyOffset) % missionList.length;

  return missionList[missionIndex];
}


// ─────────────────────────────
// INFORMAZIONI DEI TRE LIVELLI
// ─────────────────────────────

const energyData = {
  low: {
    minutes: 4,
    xp: 10,
    emoji: '🧘'
  },

  medium: {
    minutes: 9,
    xp: 20,
    emoji: '🧘'
  },

  high: {
    minutes: 15,
    xp: 30,
    emoji: '🥋'
  }
};


// ─────────────────────────────
// CONTROLLO QUEST GIÀ COMPLETATA
// ─────────────────────────────

const completedDate =
  localStorage.getItem('kendoMamaCompletedDate');

const savedEnergy =
  localStorage.getItem('kendoMamaCompletedEnergy');

const questAlreadyCompleted =
  completedDate === today;


// ─────────────────────────────
// MOSTRA UNA MISSIONE
// ─────────────────────────────

function showMission(energy) {
  const data = energyData[energy];

  if (!data || !missionText) {
    return;
  }

  const dailyMission = getDailyMission(energy);

  missionText.textContent =
    `${data.emoji} ${dailyMission} • ${data.minutes} minuti`;

  selectedEnergy = energy;
  reward = data.xp;

  if (mission) {
    mission.classList.remove('hidden');
  }
}


// ─────────────────────────────
// SELEZIONE DEL LIVELLO DI ENERGIA
// ─────────────────────────────

document
  .querySelectorAll('.energy button')
  .forEach(button => {
    button.addEventListener('click', () => {

      if (questAlreadyCompleted) {
        return;
      }

      document
        .querySelectorAll('.energy button')
        .forEach(otherButton => {
          otherButton.classList.remove('selected');
        });

      button.classList.add('selected');

      const energy =
        button.dataset.energy ||
        button.dataset.level;

      showMission(energy);
    });
  });


// ─────────────────────────────
// COMPLETAMENTO DELLA QUEST
// ─────────────────────────────

if (complete) {
  complete.addEventListener('click', () => {

    if (!selectedEnergy || reward === 0) {
      if (result) {
        result.textContent =
          'Prima scegli il tuo livello di energia 🌸';
      }

      return;
    }

    const lastCompletedDate =
      localStorage.getItem('kendoMamaCompletedDate');

    if (lastCompletedDate === today) {
      if (result) {
        result.textContent =
          'La quest di oggi è già stata completata 🌸';
      }

      return;
    }

    xp += reward;

    localStorage.setItem('kendoMamaXp', xp);
    localStorage.setItem(
      'kendoMamaCompletedDate',
      today
    );
    localStorage.setItem(
      'kendoMamaCompletedEnergy',
      selectedEnergy
    );

    if (xpEl) {
      xpEl.textContent = xp;
    }

    if (result) {
      result.textContent =
        `Quest completata! +${reward} XP 🌸`;
    }

    lockDailyQuest();
  });
}


// ─────────────────────────────
// BLOCCA LA QUEST FINO A DOMANI
// ─────────────────────────────

function lockDailyQuest() {
  document
    .querySelectorAll('.energy button')
    .forEach(button => {
      button.disabled = true;
      button.classList.remove('selected');
    });

  if (savedEnergy) {
    const completedButton =
      document.querySelector(
        `.energy button[data-energy="${savedEnergy}"],
         .energy button[data-level="${savedEnergy}"]`
      );

    if (completedButton) {
      completedButton.classList.add('selected');
    }

    showMission(savedEnergy);
  }

  if (complete) {
    complete.disabled = true;
    complete.textContent = 'Quest completata ✓';
  }

  if (result) {
    result.textContent =
      'Oggi hai già completato la tua quest. Torna domani 🌸';
  }
}


// ─────────────────────────────
// RIPRISTINO ALL'APERTURA
// ─────────────────────────────

if (questAlreadyCompleted) {
  lockDailyQuest();
}
