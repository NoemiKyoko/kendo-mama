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
// Funziona anche se la schermata iniziale
// è stata eliminata.
// ─────────────────────────────

if (enter && welcome && dojo) {
  enter.addEventListener('click', () => {
    welcome.classList.add('hidden');
    dojo.classList.remove('hidden');
  });
}


// ─────────────────────────────
// MISSIONI DEL GIORNO
// ─────────────────────────────

const missions = [
  '🌸 Respirazione profonda',
  '🤰 Mobilità dolce del bacino',
  '🧘 Stretching gentile',
  '🚶 Passeggiata tranquilla',
  '💧 Pausa di idratazione',
  '❤️ Momento di rilassamento',
  '🌿 Allungamento della schiena',
  '🍃 Dieci respiri lenti'
];


// Creiamo una data nel formato anno-mese-giorno.
// In questo modo la missione cambia ogni giorno.

const now = new Date();

const today = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0')
].join('-');

let savedDay = localStorage.getItem('kendoMissionDay');
let savedMission = localStorage.getItem('kendoMission');


// Se è un nuovo giorno, scegliamo una nuova missione.

if (savedDay !== today || !savedMission) {
  const randomIndex = Math.floor(Math.random() * missions.length);

  savedMission = missions[randomIndex];

  localStorage.setItem('kendoMissionDay', today);
  localStorage.setItem('kendoMission', savedMission);
}


// ─────────────────────────────
// SCELTA DEL LIVELLO DI ENERGIA
// ─────────────────────────────

document.querySelectorAll('.energy button').forEach(button => {
  button.addEventListener('click', () => {

    // Togliamo la selezione dagli altri pulsanti.

    document
      .querySelectorAll('.energy button')
      .forEach(otherButton => {
        otherButton.classList.remove('selected');
      });


    // Evidenziamo il pulsante scelto.

    button.classList.add('selected');


    // Leggiamo gli XP assegnati al pulsante.

    reward = Number(button.dataset.xp);


    // Mostriamo la missione con la durata scelta.

    missionText.textContent =
      `${savedMission} • ${button.dataset.minutes} minuti`;


    // Facciamo apparire la missione.

    mission.classList.remove('hidden');


    // Puliamo l'eventuale messaggio precedente.

    result.textContent = '';
  });
});


// ─────────────────────────────
// QUEST COMPLETATA
// ─────────────────────────────

complete.addEventListener('click', () => {

  // Se non è stato scelto un livello,
  // non assegniamo XP.

  if (reward === 0) {
    result.textContent =
      'Prima scegli il tuo livello di energia 🌱';

    return;
  }


  // Aggiungiamo la ricompensa agli XP.

  xp += reward;


  // Salviamo gli XP nel dispositivo.

  localStorage.setItem('kendoMamaXp', xp);


  // Aggiorniamo il numero visibile.

  xpEl.textContent = xp;


  // Mostriamo il messaggio finale.

  result.textContent =
    `Quest completata! Hai guadagnato ${reward} XP 🌸`;


  // Impediamo di premere due volte per sbaglio
  // senza scegliere nuovamente una missione.

  reward = 0;

  document
    .querySelectorAll('.energy button')
    .forEach(button => {
      button.classList.remove('selected');
    });
});
