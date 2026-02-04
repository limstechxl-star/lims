/**
 * Theme Manager for LabAx
 * Handles dark/light mode toggling, persistence, and system preference detection.
 */

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Icons
    const moonIcon = '<i class="fa-solid fa-moon"></i>';
    const sunIcon = '<i class="fa-solid fa-sun"></i>'; // Ensure you have FontAwesome loaded

    // Check Local Storage or System Preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        enableDarkMode();
    }

    // Toggle Event Listener
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }

    function enableDarkMode() {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        if (themeToggleBtn) themeToggleBtn.innerHTML = sunIcon;
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        if (themeToggleBtn) themeToggleBtn.innerHTML = moonIcon;
    }
});
