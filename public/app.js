import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, addDoc, deleteDoc, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBz-X8OPCOErD-CNECR7b6czG005pV5u2E",
  authDomain: "kidscupstopwatch.firebaseapp.com",
  projectId: "kidscupstopwatch",
  storageBucket: "kidscupstopwatch.firebasestorage.app",
  messagingSenderId: "1023843504707",
  appId: "1:1023843504707:web:980152b2c852d7977efaf6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let startTime = null;
let raceActive = false;

const statusDiv = document.getElementById("status");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const racerForm = document.getElementById("racerForm");
const stopButtonsDiv = document.getElementById("stopButtons");
const resultsTable = document.querySelector("#resultsTable tbody");
const resetBtn = document.getElementById("resetBtn");

startBtn.onclick = async () => {
  startTime = Date.now();
  raceActive = true;
  await setDoc(doc(db, "race", "current"), { startTime });
};

racerForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(racerForm);
  stopButtonsDiv.innerHTML = "";
  for (let [key, value] of formData.entries()) {
    const btn = document.createElement("button");
    btn.textContent = `Stop ${value}`;
    btn.onclick = async () => {
      if (!raceActive || !startTime) return;
      const stopTime = Date.now();
      const elapsed = stopTime - startTime;
      await addDoc(collection(db, "race", "current", "results"), {
        name: value,
        time: elapsed
      });
    };
    stopButtonsDiv.appendChild(btn);
  }
};

resetBtn.onclick = async () => {
  await setDoc(doc(db, "race", "current"), { startTime: null });
  const resultsSnap = await getDocs(collection(db, "race", "current", "results"));
  resultsSnap.forEach(async (docItem) => {
    await deleteDoc(doc(db, "race", "current", "results", docItem.id));
  });
};

onSnapshot(doc(db, "race", "current"), (docSnap) => {
  const data = docSnap.data();
  if (data && data.startTime) {
    startTime = data.startTime;
    raceActive = true;
    statusDiv.textContent = "Race in progress";
  } else {
    startTime = null;
    raceActive = false;
    statusDiv.textContent = "Race not started";
    timerDisplay.textContent = "00:00.00";
  }
});

onSnapshot(query(collection(db, "race", "current", "results"), orderBy("time")), (snapshot) => {
  resultsTable.innerHTML = "";
  snapshot.forEach(docSnap => {
    const { name, time } = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `<td>${name}</td><td>${(time / 1000).toFixed(2)}s</td>`;
    resultsTable.appendChild(row);
  });
});

setInterval(() => {
  if (raceActive && startTime) {
    const elapsed = Date.now() - startTime;
    const seconds = (elapsed / 1000).toFixed(2);
    timerDisplay.textContent = `${seconds}s`;
  }
}, 100);