import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, get, child } 
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCu_WUd66NRLa_8uI06UXVTlkDh74dMBqU",
  authDomain: "vasanth-ee54c.firebaseapp.com",
  databaseURL: "https://vasanth-ee54c-default-rtdb.firebaseio.com",
  projectId: "vasanth-ee54c",
  storageBucket: "vasanth-ee54c.firebasestorage.app",
  messagingSenderId: "668556425496",
  appId: "1:668556425496:web:1b3aab6bf95a5baa19c66d",
  measurementId: "G-8R23976J89"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase();

// 🔹 Railway OTP backend URL
const FUNCTION_URL = "https://your-railway-app.up.railway.app/sendOtp";

// ---------------- UI SWITCH ----------------
function switchToRegister(){
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("registerBox").style.display = "block";
}
function switchToLogin(){
  document.getElementById("registerBox").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
}
window.switchToRegister = switchToRegister;
window.switchToLogin = switchToLogin;

// ---------------- OTP SEND ----------------

// LOGIN OTP
window.sendOtpLogin = async function(){
  const email = document.getElementById("loginEmail").value;
  if(!email) return alert("Enter email first");

  const res = await fetch(FUNCTION_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ email:email })
  });
  const data = await res.json();
  window.loginOTP = data.otp;

  alert("OTP sent to email");
};

// VERIFY LOGIN OTP
window.verifyLoginOtp = function(){
  const otp = document.getElementById("loginOtp").value;

  if(otp === window.loginOTP){
    alert("Login Successful!");
  } else {
    alert("Invalid OTP");
  }
};

// REGISTER OTP
window.sendRegisterOtp = async function(){
  const email = document.getElementById("regEmail").value;
  if(!email) return alert("Enter email first");

  const res = await fetch(FUNCTION_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ email: email })
  });
  const data = await res.json();
  window.registerOTP = data.otp;

  alert("OTP Sent to Email");
};

// COMPLETE REGISTRATION
window.completeRegister = async function(){
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const otp = document.getElementById("regOtp").value;

  if(otp !== window.registerOTP)
    return alert("Incorrect OTP!");

  set(ref(db, "users/" + email.replace(".", "_")), {
    name: name,
    email: email,
    password: password
  });

  alert("Account Created Successfully!");
  switchToLogin();
};

// LOGIN WITH PASSWORD
window.loginWithPassword = async function(){
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const snapshot = await get(child(ref(db), "users/" + email.replace(".", "_")));

  if(snapshot.exists()){
    let data = snapshot.val();
    if(data.password === password){
      alert("Login Successful!");
    } else {
      alert("Wrong Password!");
    }
  } else {
    alert("Account not found!");
  }
};
