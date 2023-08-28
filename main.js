const initialTerms = ["Hello", "Goodbye", "Good", "I want"]
const chat = document.getElementById("chat-historic")
const input = document.getElementById("message-input")
const btnSend = document.getElementById("btn-submit")

btnSend.addEventListener("click", function () {
  const messageUser = input.value.trim() // trim() - clears whitespace from string.
  if (messageUser !== "") {
    addMessage("user", messageUser)

    const termFound = initialTerms.find((term) =>
      messageUser.toLowerCase().includes(term.toLowerCase())
    )

    if (termFound) {
      conversation(termFound)
    } else {
      addMessage("bot", "Sorry! I didn't understand. Can you repeat, please?")
    }
    input.value = ""
  }
})

function conversation(term) {
  const response = getResponse(term)
  addMessage("bot", response)
}

function getResponse(term) {
  switch (term.toLowerCase()) {
    case "hello":
      return "Hello! How can I help?"
    case "goodbye":
      return "Goodbye! Hope this helps!"
    case "good":
      return "I'm glad this helped you!"
    case "i want":
      return "What do you want?"
  }
}

function addMessage(sender, message) {
  const messageElement = document.createElement("div")
  messageElement.className = sender === "user" ? "user-message" : "bot-message"
  messageElement.textContent = message
  chat.appendChild(messageElement)
  chat.scrollTop = chat.scrollHeight
}

function btnmessage() {
  let message = document.getElementById("message-input")
  if (!message.value) {
    message.style.border = "1px solid red"
  } else {
    message.style.border = "none"
  }
}
