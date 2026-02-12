
import { initHeroesUI } from './ui/heroes.js';
import { initEquipmentUI } from './ui/equipment.js';
import { initContentsUI } from './ui/contents.js';
import { initPresetsUI } from './ui/presets.js';
import { initHelpUI } from './ui/help.js';

// App Entry Point
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Access Authentication Logic
    const AUTH_CODE = 'senafinal0522';
    const authOverlay = document.getElementById('auth-overlay');
    const authInput = document.getElementById('auth-code-input');
    const authBtn = document.getElementById('auth-submit-btn');
    const authError = document.getElementById('auth-error-msg');

    const checkAuth = () => {
        const isAuth = sessionStorage.getItem('sena_auth') === 'true';
        if (isAuth) {
            authOverlay.style.display = 'none';
        } else {
            authOverlay.style.display = 'flex';
        }
    };

    const handleAuth = () => {
        if (authInput.value === AUTH_CODE) {
            sessionStorage.setItem('sena_auth', 'true');
            authOverlay.style.opacity = '0';
            setTimeout(() => { authOverlay.style.display = 'none'; }, 500);
        } else {
            authError.style.display = 'block';
            authInput.value = '';
            authInput.focus();
        }
    };

    authBtn.addEventListener('click', handleAuth);
    authInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAuth();
    });

    checkAuth();

    console.log("Sena-Re Gear Manager Initialized with DB Backend");

    // Initialize Sub-modules (awaiting async setup)
    await initHeroesUI();
    await initEquipmentUI();
    await initContentsUI();
    await initPresetsUI();
    initHelpUI();

    // Navigation Logic
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('page-title');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all nav items
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active to clicked nav item
            link.classList.add('active');

            // Get target tab
            const tabName = link.getAttribute('data-tab');

            // Update Title
            const sectionTitles = {
                'dashboard': '대시보드',
                'heroes': '영웅 관리',
                'equipment': '장비 보관함',
                'contents': '세팅 최적화',
                'presets': '프리셋 관리',
                'settings': '설정'
            };
            pageTitle.innerText = sectionTitles[tabName];

            // Show/Hide Sections
            sections.forEach(sec => sec.style.display = 'none');

            const targetSection = document.getElementById(`${tabName}-section`);
            if (targetSection) {
                targetSection.style.display = 'block';
            } else {
                // Temporary for unimplemented sections
                console.log(`Section ${tabName} not implemented yet`);
            }
        });
    });
});
