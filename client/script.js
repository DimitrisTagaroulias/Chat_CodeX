import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

// For showing the three dots while it's "thinking"
function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    // Check if we are still typing
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// Create unique Id for every single message to be able to map over them

function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexadecimalString}`;
}

// Dialogue stripes
function chatStripe(isAi, value, uniqueId) {
  return (
    //
    `
    <div class="wrapper ${isAi && "ai"}">
      <div class="chat">
        <div class="profile">
          <img
            src="${isAi ? bot : user}"
            alt="${isAi ? "bot" : "user"}"
          />
        </div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
    `
  );
}

// Handler Submit function

const handleSubmit = async (e) => {
  e.preventDefault();
  // Taking the data from the Form
  const data = new FormData(form);

  // User's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  // Bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, "", uniqueId);

  // Put the new message in view
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Fetch the newly created div
  const messageDiv = document.getElementById(uniqueId);

  // For the three dots to be appeared as loading state
  loader(messageDiv);

  // Fetch data from server -> bot's response
  const response = await fetch("http://localhost:5000/", {
    method: "POST",
    headers: {
      "Content-Type": " application/json",
    },
    body: JSON.stringify({ prompt: data.get("prompt") }),
  });

  // Stop loading (three dots)
  clearInterval(loadInterval);
  // Clear the dots
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.json();

    messageDiv.innerHTML = "Something went wrong...";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    handleSubmit(e);
  }
});
