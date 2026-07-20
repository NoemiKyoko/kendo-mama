const enter = document.getElementById('enter');
const welcome = document.getElementById('welcome');
const dojo = document.getElementById('dojo');
const xpEl = document.getElementById('xp');
const mission = document.getElementById('mission');
const missionText = document.getElementById('missionText');
const complete = document.getElementById('complete');
const result = document.getElementById('result');

let xp = Number(localStorage.getItem('kendoMamaXp') || 0);
let reward = 0;

xpEl.textContent = xp;

enter.addEventListener('click', () => {
  welcome.classList.add('hidden');
  dojo.classList.remove('hidden');
});

document.querySelectorAll('.energy button').forEach(button => {
  button.addEventListener('click', () => {
    document
      .querySelectorAll('.energy button')
      .forEach(b => b.classList.remove('selected'));

    button.classList.add('selected');

    reward = Number(button.dataset.xp);

    missionText.textContent =
      `Missione gentile da ${button.dataset.minutes} minuti: camminata sul posto, mobilità dolce delle spalle e respirazione. Fermati se qualcosa non ti sembra giusto.`;

    mission.classList.remove('hidden');
    result.classList.add('hidden');
  });
});

complete.addEventListener('click', () => {
  if (reward === 0) {
    alert('Prima scegli una missione!');
    return;
  }

  xp += reward;

  localStorage.setItem('kendoMamaXp', String(xp));
  xpEl.textContent = xp;

  result.classList.remove('hidden');
  result.scrollIntoView({ behavior: 'smooth' });

  complete.disabled = true;

  complete.insertAdjacentHTML(
    'afterend',
    '<button id="newQuest">Nuova quest 🌸</button>'
  );

  document.getElementById('newQuest').addEventListener('click', () => {
    reward = 0;

    mission.classList.add('hidden');
    result.classList.add('hidden');

    document
      .querySelectorAll('.energy button')
      .forEach(b => b.classList.remove('selected'));

    complete.disabled = false;
    complete.textContent = 'Quest completata';

    document.getElementById('newQuest').remove();
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}
