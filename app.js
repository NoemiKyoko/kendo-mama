const enter = document.getElementById('enter');
const welcome = document.getElementById('welcome');
const dojo = document.getElementById('dojo');

const xpEl = document.getElementById('xp');
const mission = document.getElementById('mission');
const missionText = document.getElementById('missionText');
const complete = document.getElementById('complete');
const result = document.getElementById('result');


// ─────────────────────────────
// XP SALVATI
// ─────────────────────────────

let xp = Number(localStorage.getItem('kendoMamaXp') || 0);
let reward = 0;

xpEl.textContent = xp;


// ─────────────────────────────
// INGRESSO NEL DOJO
// ─────────────────────────────

if (enter && welcome && dojo) {
  enter.addEventListener('click', () => {
    welcome.classList.add('hidden');
    dojo.classList.remove('hidden');
  });
}


// ─────────────────────────────
// MISSIONI CASUALI
// ─────────────────────────────

const missions = {
  4: [
    '💧 Bevi lentamente un bicchiere d’acqua',
    '🌬️ Fai qualche respiro lento e profondo',
    '🧘 Sciogli delicatamente collo e spalle',
    '🚶 Cammina tranquillamente per casa',
    '🌱 Concediti una piccola pausa consapevole'
  ],

  9: [
    '🧘 Esegui una breve sessione di stretching',
    '🚶 Fai una passeggiata tranquilla',
    '🌸 Mobilizza dolcemente braccia, spalle e schiena',
    '💧 Alterna movimento leggero e idratazione',
    '🌬️ Respira profondamente mentre fai mobilità'
  ],

  15: [
    '🥋 Esegui una breve sessione di suburi controllati',
    '🚶 Fai una camminata a ritmo sostenuto',
    '💪 Esegui una sessione leggera di rinforzo',
    '🧘 Combina mobilità, stretching e respirazione',
    '⚔️ Ripassa lentamente postura e movimenti di base'
  ]
};


// ─────────────────────────────
// SCELTA DEL LIVELLO DI ENERGIA
// ─────────────────────────────

document.querySelectorAll('.energy button').forEach(button => {
  button.addEventListener('click', () => {

    document
      .querySelectorAll('.energy button')
      .forEach(otherButton => {
        otherButton.classList.remove('selected');
      });

    button.classList.add('selected');

    const minutes = Number(button.dataset.minutes);

    reward = Number(button.dataset.xp);

    const availableMissions = missions[minutes];

    const randomIndex =
      Math.floor(Math.random() * availableMissions.length);

    const randomMission =
      availableMissions[randomIndex];

    missionText.textContent =
      `${randomMission} • ${minutes} minuti`;

    mission.classList.remove('hidden');

    result.textContent = '';
  });
});


// ─────────────────────────────
// QUEST COMPLETATA
// ─────────────────────────────

complete.addEventListener('click', () => {

  if (reward === 0) {
    result.textContent =
      'Prima scegli il tuo livello di energia 🌱';

    return;
  }

  xp += reward;

  localStorage.setItem('kendoMamaXp', xp);

  xpEl.textContent = xp;

  result.textContent =
    `Quest completata! Hai guadagnato ${reward} XP 🌸`;

  reward = 0;

  document
    .querySelectorAll('.energy button')
    .forEach(button => {
      button.classList.remove('selected');
    });
});
