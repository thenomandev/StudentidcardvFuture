const collegeSelect=document.getElementById("collegeSelect");
const adminDropdown=document.getElementById("adminCollegeDropdown");

window.toggleAdminDropdown=function(){
if(adminDropdown.style.display==="block"){
adminDropdown.style.display="none";
}else{
filterAdminCollegeList();
adminDropdown.style.display="block";
}
};

window.filterAdminCollegeList=function(){
const input=collegeSelect.value.toLowerCase();

adminDropdown.innerHTML="";

Object.keys(window.allColleges || {}).forEach((key)=>{
const college=window.allColleges[key];

const match=
key.toLowerCase().includes(input) ||
(college.collegeNameEn || "").toLowerCase().includes(input) ||
(college.collegeNameBn || "").toLowerCase().includes(input);

if(match){
const item=document.createElement("div");

item.className="college-item";
item.innerText=college.collegeNameEn || key;

item.onclick=function(){
collegeSelect.value=college.collegeNameEn || key;
collegeSelect.dataset.selectedId=key;
adminDropdown.style.display="none";
};

adminDropdown.appendChild(item);
}
});
};