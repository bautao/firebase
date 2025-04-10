import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, addDoc, deleteDoc, query, orderBy, getDocs, serverTimestamp, Timestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
let localStartTime = null;
let raceActive = false;

const statusDiv = document.getElementById("status");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const racerForm = document.getElementById("racerForm");
const stopButtonsDiv = document.getElementById("stopButtons");
const resultsTable = document.querySelector("#resultsTable tbody");
const resetBtn = document.getElementById("resetBtn");

startBtn.onclick = async () => {

  startTime = serverTimestamp();
  localStartTime = new Date();
  raceActive = true;
  await setDoc(doc(db, "race", "current"), { startTime });
};

stopBtn.onclick = async () => {
  raceActive = false;
  await setDoc(doc(db, "race", "current"), { startTime: null });
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
    localStartTime = data.startTime;
    raceActive = true;
    statusDiv.textContent = "Race in progress";
  } else {
    startTime = null;
    localStartTime = null;
    raceActive = false;
    statusDiv.textContent = "Race not started";
    timerDisplay.textContent = "00:00.00";
  }
});

stop1Btn.onclick =  async () => {
    console.log("stopping 1")
    setTime("Bahn 1");
};

stop2Btn.onclick =  async () => {
    console.log("stopping 2")
    setTime("Bahn 2");
};

stop3Btn.onclick =  async () => {
    console.log("stopping 3")
    setTime("Bahn 3");
};

stop4Btn.onclick =  async () => {
    console.log("stopping 4")
    setTime("Bahn 4");
};

async function setTime(nameValue){

//    const localTest = Date.now();
//    console.log("stopping 1" + nameValue)
//    await addDoc(collection(db, "Time", "startTime", "startTime"), {
//        test: timeTest
//    });
//
//    const docRef2 = doc(db, "Time", "startTime");
//    const docSnap = await getDoc(docRef2);
//
//   if (docSnap.exists()) {
//         const data = docSnap.data();
//         const timestamp = data.timestamp;
//
//         // Convert to Date object
//         const date = timestamp.toDate();
//         console.log("Document data:", data);
//         console.log("Timestamp:", date);
//    }else {
//          console.log("No such document!");
//        }


//    const secondTime = Date.now();
//    console.log(secondTime );
//    console.log(localTest );
//    console.log(secondTime-localTest );


    if (!raceActive || !startTime) return;
        const stopTime = serverTimestamp();
        console.log("stoptime" + stopTime)
//      const elapsed = stopTime - startTime;
//        const docRef2 = doc(db, "Time", "startTime");
//        const docSnap = await getDoc(docRef2);
//        if (docSnap.exists()) {
//           const data = docSnap.data();
//           const timestamp = data.timestamp;
//
//           // Convert to Date object
//           const date = timestamp.toDate();
//           console.log("Document data:", data);
//           console.log("Timestamp:", date);
//           const elapsedTest = stopTime.data().toDate() - date;
//           console.log("elapsed:", elapsedTest);
//        }

        await addDoc(collection(db, "race", "current", "results"), {
            name: nameValue,
            time: stopTime
        });

//
//        const docRef2 = doc(db, "Time", "startTime");
//        const docSnap = await getDoc(docRef2);
//
//        if (docSnap.exists()) {
//           const data = docSnap.data();
//           const timestamp = data.timestamp;
//
//           // Convert to Date object
//           const date = timestamp.toDate();
//           console.log("Document data:", data);
//           console.log("Timestamp:", date);
//        }else {
//            console.log("No such document!");
//          }

}

async function getStartTime(){

    console.log("getstarttime");
    const docRef2 = doc(db, "race", "current");
    const docSnap = await getDoc(docRef2);

    if (docSnap.exists()) {
       const data = docSnap.data();
       const timestamp = data.startTime;

       // Convert to Date object
       const date = timestamp;
       console.log("Document data:", data);
       console.log("startdate:", date.toDate());
       return date.toDate();
    }else {
        console.log("No such document!");
      }

}

onSnapshot(query(collection(db, "race", "current", "results"), orderBy("time")), (snapshot) => {
  resultsTable.innerHTML = "";
  getStartTime().then((startingTime) => {
      snapshot.forEach(docSnap => {
        const { name, time } = docSnap.data();
        const row = document.createElement("tr");
//        console.log("start: "+ startingTime);
//        console.log("stop: "+ time.toDate());
        const elapsed = time.toDate() - startingTime;
        const displayTime = (elapsed/1000).toFixed(2);
//        console.log("elapsed: ", displayTime );

    //
    //    const timestamp = timeData.timestamp
    //    const date = timestamp.toDate();
    //    console.log(timeData);
    //    console.log(timeData.timestamp);

        //todo: fix time here
        row.innerHTML = `<td>${name}</td><td>${displayTime}s</td>`;
        resultsTable.appendChild(row);
      });

    })
    .catch((error) => {
     console.error("Error:", error); // Handle any errors
});

});

setInterval(() => {
//    console.log("localStartTime", startTime.toMillis());
//    console.log("localStartTime12133", startTime);
//    const testing = Date.now();
//    console.log("localStartTime2", testing);
//    const diff = testing - startTime.toMillis();
//    console.log("diff: ", diff)
  if (raceActive && localStartTime) {
    const elapsed = Date.now() - startTime.toMillis();
    const seconds = (elapsed / 1000).toFixed(2);
    timerDisplay.textContent = `${seconds}s`;
  }
}, 100);