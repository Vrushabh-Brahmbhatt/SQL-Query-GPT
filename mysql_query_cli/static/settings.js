// settings.js
document.addEventListener('DOMContentLoaded', function() {
    // Load settings from localStorage
    loadSettings();
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeStatus = document.getElementById('theme-status');
    
    if (themeToggle && themeStatus) {
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                themeStatus.textContent = 'Dark Mode';
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                themeStatus.textContent = 'Light Mode';
                localStorage.setItem('theme', 'light');
            }
            showNotification('Theme updated successfully', 'success');
        });
    }
    
    // Font size controls
    const fontDecrease = document.getElementById('font-decrease');
    const fontIncrease = document.getElementById('font-increase');
    const fontSizeDisplay = document.getElementById('font-size-display');
    
    const fontSizes = ['Small', 'Medium', 'Large', 'X-Large'];
    let currentFontSizeIndex = fontSizes.indexOf('Medium'); // Default
    
    if (fontDecrease && fontIncrease && fontSizeDisplay) {
        updateFontSize();
        
        fontDecrease.addEventListener('click', function() {
            if (currentFontSizeIndex > 0) {
                currentFontSizeIndex--;
                updateFontSize();
                localStorage.setItem('fontSize', fontSizes[currentFontSizeIndex]);
                showNotification('Font size updated', 'info');
            }
        });
        
        fontIncrease.addEventListener('click', function() {
            if (currentFontSizeIndex < fontSizes.length - 1) {
                currentFontSizeIndex++;
                updateFontSize();
                localStorage.setItem('fontSize', fontSizes[currentFontSizeIndex]);
                showNotification('Font size updated', 'info');
            }
        });
    }
    
    function updateFontSize() {
        const fontSize = fontSizes[currentFontSizeIndex];
        if (fontSizeDisplay) {
            fontSizeDisplay.textContent = fontSize;
        }
        
        // Remove any existing font size classes
        document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
        // Add the current font size class
        document.body.classList.add(`font-${fontSize.toLowerCase()}`);
    }
    
    // Settings buttons
    const saveSettingsBtn = document.getElementById('save-settings');
    const resetSettingsBtn = document.getElementById('reset-settings');
    
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            saveSettings();
            showNotification('Settings saved successfully', 'success');
        });
    }
    
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', function() {
            resetSettings();
            showNotification('Settings reset to default', 'info');
        });
    }
    
    // Function to load settings from localStorage
    function loadSettings() {
        // Load theme setting
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark' && themeToggle && themeStatus) {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
            themeStatus.textContent = 'Dark Mode';
        }
        
        // Load font size
        const savedFontSize = localStorage.getItem('fontSize') || 'Medium';
        currentFontSizeIndex = fontSizes.indexOf(savedFontSize);
        if (currentFontSizeIndex === -1) currentFontSizeIndex = 1; // Default to Medium if invalid
        updateFontSize();
        
        // Load query confirmation setting
        const queryConfirm = localStorage.getItem('queryConfirm') !== 'false'; // Default is true
        const queryConfirmElement = document.getElementById('query-confirm');
        if (queryConfirmElement) {
            queryConfirmElement.checked = queryConfirm;
        }
        
        // Load chat assistant visibility setting
        const chatAlwaysShow = localStorage.getItem('chatAlwaysShow') !== 'false'; // Default is true
        const chatAlwaysShowElement = document.getElementById('chat-always-show');
        if (chatAlwaysShowElement) {
            chatAlwaysShowElement.checked = chatAlwaysShow;
        }
        
        // Load language setting
        const language = localStorage.getItem('language') || 'en';
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = language;
        }
        
        // Load AI model setting
        const model = localStorage.getItem('model') || 'gpt-3.5-turbo';
        const modelSelect = document.getElementById('model-select');
        if (modelSelect) {
            modelSelect.value = model;
        }
    }
    
    // Function to save all settings to localStorage
    function saveSettings() {
        // Theme is saved on toggle
        
        // Save query confirmation setting
        const queryConfirmElement = document.getElementById('query-confirm');
        if (queryConfirmElement) {
            localStorage.setItem('queryConfirm', queryConfirmElement.checked);
        }
        
        // Save chat assistant visibility setting
        const chatAlwaysShowElement = document.getElementById('chat-always-show');
        if (chatAlwaysShowElement) {
            localStorage.setItem('chatAlwaysShow', chatAlwaysShowElement.checked);
        }
        
        // Save language setting
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            localStorage.setItem('language', languageSelect.value);
        }
        
        // Save AI model setting
        const modelSelect = document.getElementById('model-select');
        if (modelSelect) {
            localStorage.setItem('model', modelSelect.value);
        }
        
        // Apply settings to the application
        applySettings();
    }
    
    // Function to reset all settings to default
    function resetSettings() {
        // Reset theme
        document.body.classList.remove('dark-mode');
        if (themeToggle && themeStatus) {
            themeToggle.checked = false;
            themeStatus.textContent = 'Light Mode';
        }
        localStorage.setItem('theme', 'light');
        
        // Reset font size
        currentFontSizeIndex = fontSizes.indexOf('Medium');
        updateFontSize();
        localStorage.setItem('fontSize', 'Medium');
        
        // Reset query confirmation
        const queryConfirmElement = document.getElementById('query-confirm');
        if (queryConfirmElement) {
            queryConfirmElement.checked = true;
        }
        localStorage.setItem('queryConfirm', true);
        
        // Reset chat visibility
        const chatAlwaysShowElement = document.getElementById('chat-always-show');
        if (chatAlwaysShowElement) {
            chatAlwaysShowElement.checked = true;
        }
        localStorage.setItem('chatAlwaysShow', true);
        
        // Reset language
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = 'en';
        }
        localStorage.setItem('language', 'en');
        
        // Reset model
        const modelSelect = document.getElementById('model-select');
        if (modelSelect) {
            modelSelect.value = 'gpt-3.5-turbo';
        }
        localStorage.setItem('model', 'gpt-3.5-turbo');
        
        // Apply settings
        applySettings();
    }
    
    // Function to apply settings across the application
    function applySettings() {
        // Most settings are applied on page load
        // This function can be expanded as needed for additional settings
        
        // Update chat assistant visibility based on setting
        const chatAlwaysShow = localStorage.getItem('chatAlwaysShow') !== 'false';
        const chatbotToggle = document.getElementById('chatbot-toggle');
        
        if (chatbotToggle) {
            if (chatAlwaysShow) {
                chatbotToggle.style.display = 'flex';
            } else {
                chatbotToggle.style.display = 'none';
            }
        }
    }
    
    // Notification system - Use the same one from script.js for consistency
    function showNotification(message, type = 'info') {
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
    
    // Apply initial settings
    applySettings();
});