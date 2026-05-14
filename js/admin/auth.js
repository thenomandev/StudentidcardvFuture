import { auth } from "../../firebase-config.js";
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");

function goLogin() {
  window.location.href = "../login.html";
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let errorBox = document.getElementById("loginErrorMsg");

    if (!errorBox) {
      errorBox = document.createElement("div");
      errorBox.id = "loginErrorMsg";
      errorBox.style.color = "#ff4d4f";
      errorBox.style.fontSize = "14px";
      errorBox.style.marginTop = "10px";
      errorBox.style.textAlign = "left";
      errorBox.style.fontWeight = "500";

      loginForm.insertBefore(errorBox, loginForm.querySelector("button"));
    }

    errorBox.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      errorBox.textContent = "Enter email and password.";
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        errorBox.textContent = "Incorrect email or password.";
      } else if (error.code === "auth/too-many-requests") {
        errorBox.textContent = "Too many attempts. Try again later.";
      } else {
        errorBox.textContent = "Login failed. Please try again.";
      }
    }
  });
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    if (!loginForm) {
      goLogin();
    }
  } else {
    if (user.email !== "thenomandev@gmail.com") {
      signOut(auth);
      if (loginForm) {
        let errorBox = document.getElementById("loginErrorMsg");

        if (!errorBox) {
          errorBox = document.createElement("div");
          errorBox.id = "loginErrorMsg";
          errorBox.style.color = "#ff4d4f";
          errorBox.style.fontSize = "14px";
          errorBox.style.marginTop = "10px";
          errorBox.style.textAlign = "left";
          errorBox.style.fontWeight = "500";

          loginForm.insertBefore(errorBox, loginForm.querySelector("button"));
        }

        errorBox.textContent = "You are not authorized to access admin panel.";
      }
      return;
    }

    document.body.style.display = "block";
  }
});

window.logout = async function () {
  await signOut(auth);
  goLogin();
};