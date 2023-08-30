/* Elements */
const chat = document.getElementById("chat-historic")
const input = document.getElementById("message-input")
const btnSend = document.getElementById("btn-submit")

/* Initial terms recognized by the bot */
const initialTerms = ["hello", "goodbye", "good", "i want"]

/* Loan options and information */
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
/* Check if the user is authenticated */
let isAuthenticated = false

/* Function to prompt user for username and password */
function promptForCredentials() {
  const userName = prompt("Enter your username:")
  const password = prompt("Enter your password:")

  /* Check if the entered credentials are correct */
  if (userName === "user1" && password === "12345") {
    isAuthenticated = true
    addMessage("bot", "Authentication successful. How can I assist you today?")
  } else {
    addMessage("bot", "Authentication failed. Please try again.")
  }
}

/* Event listener for submit button */
btnSend.addEventListener("click", handleSendMessage)

function handleSendMessage() {
  // Check if the user is authenticated before processing the message
  if (!isAuthenticated) {
    promptForCredentials()
    return
  }
  const messageUser = input.value.trim()
  if (messageUser !== "") {
    const lowerCaseMessage = messageUser.toLowerCase()

    addMessage("user", messageUser)
    addMessageToHistory("user", messageUser)

    const termFound = matchTerm(lowerCaseMessage)
    if (termFound) {
      initiateConversation(termFound)
    } else if (lowerCaseMessage.includes("loan")) {
      initiateConversation("loan")
    } else {
      addMessage("bot", "Sorry! I didn't understand. Can you repeat, please?")
      addMessageToHistory(
        "bot",
        "Sorry! I didn't understand. Can you repeat, please?"
      )
    }

    input.value = ""
  }
}

/* Responsible for starting a chat conversation based on the term given as an argument */
function initiateConversation(term) {
  const response = getResponse(term)
  addMessage("bot", response)
  addMessageToHistory("bot", response)
}

/* Search for a matching term in the initial keywords (initialTerms) based on the message given as an argument*/
function matchTerm(message) {
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
  chat.scrollTop =
    chat.scrollHeight /* Adjusted to show the most recent message */
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
    addMessageToHistory("user", selectedOption.option) // Add user message to history
    addMessageToHistory("bot", selectedOption.info) // Add bot message to history
    input.value = "" // Clear input
  }
})

/* Framework for storing conversation message history */
const conversationHistory = []

function addMessageToHistory(sender, message) {
  const timestamp = new Date()
  const messageObject = {
    sender: sender,
    message: message,
    timestamp: timestamp,
  }
  conversationHistory.push(messageObject)
}

// Export conversation history
const exportButton = document.getElementById("export-button")

exportButton.addEventListener("click", function () {
  const csvContent = prepareCSV(conversationHistory)
  downloadCSV(csvContent, "conversation_history.csv")
})

/* Responsible for formatting the conversation history in a CSV(Comma-Separated Values) format */
function prepareCSV(history) {
  let csv = "Sender,Message,Timestamp\n"

  history.forEach((entry) => {
    const formattedTimestamp = entry.timestamp.toLocaleString()
    csv += `${entry.sender},"${entry.message}",${formattedTimestamp}\n`
  })

  return csv
}

/* Responsible for creating a download link to a CSV file and allowing the user to download that file */
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  }) /* Blob is a data structure representing raw binary data */
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  link.style.display = "none"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
