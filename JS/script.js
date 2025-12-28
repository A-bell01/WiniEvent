import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // onAuthStateChange,
  // logOut,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmzo6KodSlnjOYSdwQ_TTmXEsUg1OssZk",
  authDomain: "winievent.firebaseapp.com",
  projectId: "winievent",
  storageBucket: "winievent.firebasestorage.app",
  messagingSenderId: "1021218936462",
  appId: "1:1021218936462:web:351644af90c44e80b71bdf",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const DB = getFirestore(app);
const eventsColRef = collection(DB, "events");
const userColRef = collection(DB, "users");
const userEmail = document.getElementById("user-email");
const submitBtn = document.getElementById("submitBtn");
let currentUser;

const signUpForm = document.getElementById("signUpForm");
if (signUpForm) {
  const nameInp = document.getElementById("name");
  const emailInp = document.getElementById("email");
  const passwordInp = document.getElementById("password");

  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formValues = {
      name: nameInp.value,
      email: emailInp.value,
      password: passwordInp.value,
    };
    submitBtn.disabled === true;
    try {
      const { email, password, name } = formValues;
      const user = await createUserWithEmailAndPassword(auth, email, password);
      const { uid, accessToken } = user.user;
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "",
          email: user.user.email,
          uid,
          accessToken,
        })
      );

      const docRef = doc(userColRef, uid);
      const savedUser = await setDoc(docRef, {
        name,
        email,
        createdAt: new Date(),
      });
      alert("Signed up successfully");
      location.href = "../HTML/discover.html";
    } catch (error) {
      console.log("signupError", error);
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        alert("Email already in use");
        return;
      }
      if (
        error.message ===
        "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        alert("Password must be at least 6 characters");
        return;
      }
      alert(error.message);
    } finally {
      submitBtn.disabled === false;
    }
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const loginBtn = document.getElementById("loginBtn");
  const loginPassword = document.getElementById("loginPassword");
  const loginEmail = document.getElementById("loginEmail");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formValues = {
      password: loginPassword.value,
      email: loginEmail.value,
    };
    loginBtn.disabled === true;
    try {
      const { email, password } = formValues;
      const user = await signInWithEmailAndPassword(auth, email, password);
      const { uid, accessToken } = user.user;
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "",
          email: user.user.email,
          uid,
          accessToken,
        })
      );
      alert("Login successfully");
      location.href = "../HTML/discover.html";
    } catch (error) {
      console.log("Login error😡", error);
    } finally {
      loginBtn.disabled === false;
    }
  });
}

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     currentUser = user;
//     console.log(user);
//     userEmailEl.textContent = user.email;
//   } else {
//     //redirect login
//     window.location.href = "./login.html";
//     console.log("No User");
//   }
// });
