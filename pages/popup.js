import {backendApi} from '../constant.js';
// Authentication and userdata
let jwtToken = "";
document.addEventListener("DOMContentLoaded", async function () {
  const contentDiv = document.getElementById("contentDiv");
  const homepage = document.getElementById("homepage");
  const authpage = document.getElementById("authpage");
  const logout = document.getElementById("logout");

  await chrome.storage.local.get("jwtToken", function (result) {
    jwtToken = result.jwtToken;
    if (jwtToken !== "" && jwtToken !== undefined) {
      homepage.style.display = "block";
      authpage.style.display = "none";
      const username = "";
      //get userdata
      let token = "";
      token = result.jwtToken;
      if (token !== undefined && token !== "") {
        getuser(token);
        getCodeList(jwtToken);
      }
    } else {
      homepage.style.display = "none";
      authpage.style.display = "block";
      const signupButton = document.getElementById("SignupButton");
      const loginButton = document.getElementById("LoginButton");
      signupButton.addEventListener("click", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        signup(username, password);
      });
      loginButton.addEventListener("click", function (event) {
        console.log("login was clicked");
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        login(username, password);
      });
    }
  });

  logout.addEventListener("click", () => {
      chrome.storage.local.remove("jwtToken");
      homepage.style.display = "none";
      authpage.style.display = "block";
    }) 
});

// Auth functions
function signup(username, password) {
  console.log(backendApi);
  fetch(`${backendApi}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
    response.json();
    if(response.status==501){
      
      alert("User Already Registered!!");
    }
    else{
      console.log(response);
      login(username, password);
    }
    })
    .catch((error) => console.error("Error:", error));
}

function login(username, password) {
  const homepage = document.getElementById("homepage");
  const authpage = document.getElementById("authpage");
  try {
    fetch(`${backendApi}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        chrome.storage.local.set({ jwtToken: data }, function () {
          console.log("Data saved:", data);
          getuser(data);
          getCodeList(jwtToken);
        });

        homepage.style.display = "block";
        authpage.style.display = "none";
      })
      .catch((error) => console.error("Error:", error));
  } catch (err) {
    console.log(err);
  }
}

//Get UserData
function getuser(token) {
  fetch(`${backendApi}/auth/getUser`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      const userDom = document.getElementById("userdom");
      userDom.innerText = data;
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////


async function getCodeList(token){
  const codeListDiv = document.getElementById("code-list");
  const response = fetch(`${backendApi}/code/getCodeList`,{
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  }
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse the JSON 
  })
  .then((data) => {
   for(let i=0;i<data.length;i++){
     const titleDiv = document.createElement("div");
    titleDiv.innerHTML = data[i].title;
    titleDiv.id = data[i].codeId;
    titleDiv.classList.add("clickable-title");
    titleDiv.addEventListener("click", function() {

      const saveButton = document.getElementById('savePage');
      const editButton = document.getElementById('editPage');
      const copyButton = document.getElementById('copyPage');
      const deleteButton = document.getElementById('deletePage');
      const title = document.getElementById("title");
      const code = document.getElementById("code");
      saveButton.style.display="none";
      editButton.style.display="inline-block";
      deleteButton.style.display="inline-block";
      copyButton.style.display="inline-block";
      title.innerHTML = data[i].title;
      const codeId = data[i].codeId;
      
       fetch(`${backendApi}/code/getCode/${codeId}`,{
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
      
      ).then((response)=>{
         return response.json();
        
       
      }).then((data) => {
       console.log(data);
       code.innerHTML = data.code;
     
       //edit button event listener...
       editButton.addEventListener("click", function (){

      const title = document.getElementById("title").innerText;
      const code = document.getElementById("code").innerHTML;
        let language = "C++";
        console.log(title);
        console.log(code);
        fetch(`${backendApi}/code/editCode/${codeId}`,{
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body:JSON.stringify({title,code,language})
        }
        
        ).then((response)=>{
           return response.json();
          
         
        }).then((data)=>{
          console.log(data);
        })
       });

       //delete button event litsener...
       deleteButton.addEventListener("click", function (){
        fetch(`${backendApi}/code/deleteCode/${codeId}`,{
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }
        }
        ).then((response)=>{
           return response.json();
        }).then((data)=>{
          console.log(data);
        })
       });



    }).catch((error) => {
        // Handle errors
        console.error('Error:', error);
    });
    
    });
    codeListDiv.appendChild(titleDiv); 
   }
  });
}


//logic for create new button...
const createNew = document.getElementById("newNote");
createNew.addEventListener("click",function(){
  createNewSnyp();
});

 function createNewSnyp(){
  const saveButton = document.getElementById('savePage');
  const editButton = document.getElementById('editPage');
  const copyButton = document.getElementById('copyPage');
  const deleteButton = document.getElementById('deletePage');
  const title = document.getElementById("title");
  const code = document.getElementById("code");
  saveButton.style.display="inline-block";
  editButton.style.display="none";
  deleteButton.style.display="none";
  copyButton.style.display="none";
  title.innerHTML = "";
  code.innerHTML = "";
}


//logic for save button...
const saveButton = document.getElementById('savePage');
saveButton.addEventListener("click", function(){
   saveSnyp();
})

async function saveSnyp(){
  const title = document.getElementById("title").innerText;
  const code = document.getElementById("code").innerHTML;
  const language = "C++";
  console.log("this is title" + title);
  console.log("this is code" + code);

 await fetch(`${backendApi}/code/addCode`,{
  method: "POST",
  headers:{
    Authorization:"Bearer " + jwtToken,
    "Content-type":"application/json",
  },
  body:JSON.stringify({title,code,language})
 }).then((response)=>{
    return response.json();
 }).then((data)=>{
  console.log("this is body");
  console.log(data);
 })
}

document.getElementById("code").addEventListener("paste", function(event) {
  event.preventDefault();
  

  const pastedText = (event.clipboardData).getData("text");

  document.getElementById("code").innerText = pastedText;
  
  
});










