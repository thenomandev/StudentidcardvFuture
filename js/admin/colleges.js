import { db } from "../../firebase-config.js";
import { showToast, showConfirm } from "../ui/notifications.js";
import {
collection,
getDocs,
doc,
getDoc,
setDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


const collegeSelect=document.getElementById("collegeSelect");
function setButtonState(button, loadingText, isLoading){
if(!button) return;

if(isLoading){
button.dataset.originalText = button.innerText;
button.innerText = loadingText;
button.disabled = true;
button.style.opacity = "0.7";
button.style.cursor = "not-allowed";
}else{
button.innerText = button.dataset.originalText || button.innerText;
button.disabled = false;
button.style.opacity = "1";
button.style.cursor = "pointer";
}
}

window.allColleges={};

async function loadColleges(){
window.allColleges={};

const querySnapshot=await getDocs(collection(db,"colleges"));

querySnapshot.forEach((docSnap)=>{
window.allColleges[docSnap.id]=docSnap.data();
});
}

loadColleges();

window.loadCollege=async function(){
const id=collegeSelect.dataset.selectedId || collegeSelect.value;

if(!id) return;

const docRef=doc(db,"colleges",id);
const snap=await getDoc(docRef);

if(!snap.exists()) return;

const data=snap.data();

document.getElementById("collegeNameBn").value=data.collegeNameBn || "";
document.getElementById("collegeNameEn").value=data.collegeNameEn || "";
document.getElementById("established").value=data.established || "";
document.getElementById("transparentLogo").value=data.transparentLogo || "";
document.getElementById("whiteLogo").value=data.whiteLogo || "";
document.getElementById("principalSignature").value=data.principalSignature || "";
document.getElementById("watermark").value=data.watermark || "";

["transparentLogo","whiteLogo","principalSignature","watermark"].forEach(id=>{
restoreUploadPreview(id,"");
});

restoreUploadPreview("transparentLogo",data.transparentLogo || "");
restoreUploadPreview("whiteLogo",data.whiteLogo || "");
restoreUploadPreview("principalSignature",data.principalSignature || "");
restoreUploadPreview("watermark",data.watermark || "");
document.getElementById("website").value=data.website || "";
document.getElementById("email").value=data.email || "";
document.getElementById("phone").value=data.phone || "";
};

window.saveCollege=async function(){
const saveBtn = document.querySelector(".saveBtn");
setButtonState(saveBtn, "Saving...", true);
const id=collegeSelect.dataset.selectedId || collegeSelect.value;

if(!id){
setButtonState(saveBtn, "", false);
return showToast("Please select a college", "warning");
}

await setDoc(doc(db,"colleges",id),{
collegeNameBn:document.getElementById("collegeNameBn").value,
collegeNameEn:document.getElementById("collegeNameEn").value,
established:document.getElementById("established").value,
transparentLogo:document.getElementById("transparentLogo").value,
whiteLogo:document.getElementById("whiteLogo").value,
principalSignature:document.getElementById("principalSignature").value,
watermark:document.getElementById("watermark").value,
website:document.getElementById("website").value,
email:document.getElementById("email").value,
phone:document.getElementById("phone").value,
});

setButtonState(saveBtn, "", false);
showToast("College saved successfully", "success");

await loadColleges();
};

window.addCollege=async function(){
const addBtn = document.querySelectorAll(".saveBtn")[1];
setButtonState(addBtn, "Adding...", true);
const id=document.getElementById("newCollegeId").value.trim();
const name=document.getElementById("newCollegeName").value.trim();

if(!id || !name){
setButtonState(addBtn, "", false);
return showToast("Please fill required fields", "warning");
}

const existingSnap = await getDoc(doc(db,"colleges",id));

if (existingSnap.exists()) {
  setButtonState(addBtn, "", false);
  showToast("College ID already exists", "warning");
  return;
}

await setDoc(doc(db,"colleges",id),{
collegeNameEn:name,
collegeNameBn:"",
established:"",
transparentLogo:"",
whiteLogo:"",
principalSignature:"",
watermark:"",
website:"",
email:"",
phone:"",
});

setButtonState(addBtn, "", false);
showToast("New college added", "success");

await loadColleges();
};

window.deleteCollege=async function(){
const deleteBtn = document.querySelector(".deleteBtn");
setButtonState(deleteBtn, "Deleting...", true);
const id=collegeSelect.dataset.selectedId || collegeSelect.value;

if(!id){
setButtonState(deleteBtn, "", false);
return;
}

const confirmed = await showConfirm(
  "Delete College?",
  "This college will be permanently deleted and cannot be recovered."
);

if (!confirmed){
setButtonState(deleteBtn, "", false);
return;
}

const docRef = doc(db,"colleges",id);
const snap = await getDoc(docRef);

if (!snap.exists()) {
  setButtonState(deleteBtn, "", false);
  showToast("Already deleted", "warning");
  return;
}

await deleteDoc(docRef);

setButtonState(deleteBtn, "", false);

showToast("College deleted", "warning");

await loadColleges();

collegeSelect.value = "";
collegeSelect.dataset.selectedId = "";
};