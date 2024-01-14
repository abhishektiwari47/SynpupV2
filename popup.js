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
  fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      login(username, password);
    })
    .catch((error) => console.error("Error:", error));
}

function login(username, password) {
  const homepage = document.getElementById("homepage");
  const authpage = document.getElementById("authpage");
  try {
    fetch("http://localhost:3000/login", {
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
  fetch("http://localhost:3000/auth/getUser", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
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



