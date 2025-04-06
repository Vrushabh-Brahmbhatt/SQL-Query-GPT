// script.js

// Main JavaScript functionality for SQL Query Generator
document.addEventListener("DOMContentLoaded", () => {
    // DOM Element References
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotContainer = document.getElementById("chatbot-container");
    const closeChatbot = document.getElementById("close-chatbot");
    const chatbotForm = document.getElementById("chatbot-form");
    const userInput = document.getElementById("user-input");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const quickActions = document.getElementById("quick-actions");
    const openCliBtn = document.getElementById("open-cli-btn");
    const openChatBtn = document.getElementById("open-chat-btn");
    const exampleCards = document.querySelectorAll(".example-card");

    // Function to open CLI via fetch API
    function openCLI() {
        // Show loading indicator
        openCliBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
        
        fetch('/open-cli', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "running") {
                showNotification("CLI opened successfully", "success");
            } else {
                showNotification("Failed to open CLI", "error");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification("Connection error. Is the server running?", "error");
        })
        .finally(() => {
            // Restore button text
            openCliBtn.innerHTML = 'Open CLI';
        });
    }

    // Show notification function
    function showNotification(message, type = "info") {
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.innerHTML = `<p>${message}</p><button class="close-notification"><i class="fas fa-times"></i></button>`;
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.add("fade-out");
            setTimeout(() => notification.remove(), 500);
        }, 5000);
        
        // Close button functionality
        notification.querySelector(".close-notification").addEventListener("click", () => {
            notification.remove();
        });
    }

    // Toggle chatbot visibility
    chatbotToggle.addEventListener("click", () => {
        chatbotContainer.style.display = 
            chatbotContainer.style.display === "none" || chatbotContainer.style.display === "" 
            ? "flex" 
            : "none";
        
        // Auto-focus input when opened
        if (chatbotContainer.style.display === "flex") {
            userInput.focus();
        }
    });

    // Open chat button functionality
    openChatBtn.addEventListener("click", () => {
        chatbotContainer.style.display = "flex";
        userInput.focus();
    });

    // Close chatbot
    closeChatbot.addEventListener("click", () => {
        chatbotContainer.style.display = "none";
    });

    // Handle chatbot form submission
    chatbotForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userMessage = userInput.value.trim();
        if (userMessage === "") return;
        sendUserMessage(userMessage);
    });

    // Handle example card clicks
    exampleCards.forEach(card => {
        card.addEventListener("click", () => {
            const query = card.getAttribute("data-query");
            chatbotContainer.style.display = "flex";
            setTimeout(() => sendUserMessage(query), 300);
        });
    });

    // Send user message to chatbot
    function sendUserMessage(message) {
        displayMessage(message, "user");
        userInput.value = "";
        userInput.focus();
        sendToBackend(message);
    }

    // Handle quick action button clicks
    quickActions.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON" || e.target.parentElement.tagName === "BUTTON") {
            const button = e.target.tagName === "BUTTON" ? e.target : e.target.parentElement;
            const query = button.getAttribute("data-query");
            sendUserMessage(query);
        }
    });

    // Display message in chat window
    function displayMessage(message, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(sender);
        
        // Format code blocks in bot responses
        if (sender === "bot" && message.includes("```")) {
            const parts = message.split(/```(?:sql)?/);
            let formattedMessage = "";
            
            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 0) {
                    // Text part
                    formattedMessage += `<p>${parts[i]}</p>`;
                } else {
                    // Code part
                    formattedMessage += `<pre class="code-block"><code>${parts[i]}</code></pre>`;
                }
            }
            messageDiv.innerHTML = formattedMessage;
        } else {
            messageDiv.textContent = message;
        }
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Add typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("bot", "typing");
        typingDiv.innerHTML = '<div class="dot-typing"></div>';
        typingDiv.id = "typing-indicator";
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById("typing-indicator");
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Send message to backend
    async function sendToBackend(message) {
        try {
            showTypingIndicator();
            
            const response = await fetch("/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            removeTypingIndicator();
            displayMessage(data.reply, "bot");
        } catch (error) {
            console.error("Error communicating with backend:", error);
            removeTypingIndicator();
            displayMessage("Connection error. Is the server running?", "bot");
        }
    }

    // Initial setup
    openCliBtn.addEventListener("click", openCLI);

    // Handle keyboard shortcuts
    document.addEventListener("keydown", (e) => {
        // Alt+C to toggle chat
        if (e.altKey && e.key === "c") {
            chatbotToggle.click();
        }
        
        // Escape to close chat if open
        if (e.key === "Escape" && chatbotContainer.style.display === "flex") {
            chatbotContainer.style.display = "none";
        }
    });
});