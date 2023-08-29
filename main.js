// Elements
const chat = document.getElementById("chat-historic")
const input = document.getElementById("message-input")
const btnSend = document.getElementById("btn-submit")

// Initial terms recognized by the bot
const initialTerms = ["hello", "goodbye", "good", "i want"]

// Loan options and information
const loanOptions = [
  {
    option: "Do you want to apply for a loan?",
    info: 'To apply for a loan, please visit our loan application <a href="https://www.itau.com.br/" target="_blank">page</a>.',
  },
  {
    option: "Loan conditions",
    info: 'Our loan <a href="https://emprestimo.itau.com.br/emprestimo-consignado/proposta" target="_blank">conditions</a> include low interest rates.',
  },
  {
    option: "Help",
    info: 'If you need assistance regarding loans, please <a href="https://www.itau.com.br/atendimento-itau/para-voce" target="_blank">contact</a> our support team.',
  },
]

// Event listener for submit button
btnSend.addEventListener("click", handleSendMessage)

function handleSendMessage() {
  const messageUser =
    input.value.trim() /* trim - remove whitespace from the beginning and end of the string */
  if (messageUser !== "") {
    addMessage("user", messageUser)

    const lowerCaseMessage =
      messageUser.toLowerCase() /* Converts user message to lower case */

    const termFound = findMatchingTerm(lowerCaseMessage)
    if (termFound) {
      initiateConversation(termFound)
    } else if (lowerCaseMessage.includes("loan")) {
      initiateConversation("loan")
    } else {
      addMessage("bot", "Sorry! I didn't understand. Can you repeat, please?")
    }

    input.value = ""
  }
}
/* Responsible for starting a chat conversation based on the term given as an argument */
function initiateConversation(term) {
  const response = getResponse(term)
  addMessage("bot", response)
}
/* Search for a matching term in the initial keywords (initialTerms) based on the message given as an argument*/
function findMatchingTerm(message) {
  return initialTerms.find((term) => message.includes(term))
}
/* Responsible for returning the appropriate response based on the term provided */
function getResponse(term) {
  switch (term) {
    case "hello":
      return "Hello! How can I help?"
    case "goodbye":
      return "Goodbye! Hope this helps!"
    case "good":
      return "I'm glad this helped you!"
    case "i want":
      return "What do you want?"
    case "loan":
      const loanOptionsHTML = loanOptions
        .map(
          (option, index) =>
            `<div class="loan-option bot-message" data-option="${index}">${option.option}</div>`
        )
        .join("")
      return loanOptionsHTML
    default:
      return "Sorry, I didn't understand!"
  }
}

/* Responsible for adding messages to the chat history displayed in the interface */
function addMessage(sender, message) {
  const messageElement = document.createElement("div")
  messageElement.className = sender === "user" ? "user-message" : "bot-message"
  messageElement.innerHTML = message
  chat.appendChild(messageElement)
  chat.scrollTop = chat.scrollHeight
}

/* Responsible for updating the message input element's border style based on its content */
function updateMessageInputStyle() {
  const message = document.getElementById("message-input")
  message.style.border = !message.value ? "2px solid red" : "none"
}

/* Used to interact with the loan options presented in the chat */
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("loan-option")) {
    const selectedOptionIndex = event.target.getAttribute("data-option")
    const selectedOption = loanOptions[selectedOptionIndex]
    addMessage("user", selectedOption.option)
    addMessage("bot", selectedOption.info)
    input.value = ""
  }
})
