// Función para mostrar alertas personalizadas
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert-${type}`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '15px 25px';
    alertDiv.style.borderRadius = '10px';
    alertDiv.style.color = 'white';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    alertDiv.style.transition = 'all 0.3s ease';
    
    if (type === 'success') alertDiv.style.backgroundColor = '#28a745';
    else if (type === 'error') alertDiv.style.backgroundColor = '#dc3545';
    else alertDiv.style.backgroundColor = '#17a2b8';

    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}


const AuthService = {
    getUsers: function() {
        const users = localStorage.getItem('braincare_users');
        return users ? JSON.parse(users) : [];
    },

    register: function(name, email, password) {
        // Validaciones básicas
        if (!name || name.length < 2) {
            return { success: false, message: 'El nombre debe tener al menos 2 caracteres.' };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, message: 'Por favor, ingresa un correo electrónico válido.' };
        }

        if (password.length < 8) {
            return { success: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
        }

        const users = this.getUsers();
        
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'El correo ya está registrado.' };
        }

        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password, 
            role: 'user',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('braincare_users', JSON.stringify(users));
        return { success: true, message: 'Registro exitoso. Ya puedes iniciar sesión.' };
    },

    login: function(email, password) {
        if (!email || !password) {
            return { success: false, message: 'Todos los campos son obligatorios.' };
        }
        
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('braincare_currentUser', JSON.stringify(user));
            return { success: true, message: 'Inicio de sesión exitoso.' };
        } else {
            return { success: false, message: 'Credenciales incorrectas.' };
        }
    },

    logout: function() {
        localStorage.removeItem('braincare_currentUser');
        window.location.href = 'index.html';
    },

    getCurrentUser: function() {
        const user = localStorage.getItem('braincare_currentUser');
        return user ? JSON.parse(user) : null;
    },


    isLoggedIn: function() {
        return this.getCurrentUser() !== null;
    }
};

function updateNavbar() {
    const user = AuthService.getCurrentUser();
    const navRight = document.querySelector('.nav-right');

    if (user) {
        if (navRight) {
            navRight.innerHTML = `
                <li>
                    <a class="nav-link" href="#">
                        <img src="https://via.placeholder.com/28" class="profile-image" alt="Perfil"> 
                        <span class="user-name-display">${user.name}</span>
                    </a>
                </li>
                <li><a class="nav-link" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a></li>
            `;
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                AuthService.logout();
            });
        }
    } else {
        if (navRight) {
            navRight.innerHTML = `
                <li><a class="nav-link" href="login.html">Iniciar Sesión</a></li>
                <li><a class="nav-link" href="registro.html">Registrarse</a></li>
            `;
        }
    }
}

function updateMobileNavbar() {
    const user = AuthService.getCurrentUser();
    const mobileLinks = document.querySelector('.mobile-links');
    if (!mobileLinks) return;

    if (user) {
        mobileLinks.innerHTML = `
            <div class="menu-title">Menú Principal</div>
            <a href="index.html" class="mobile-link"><i class="fas fa-home"></i> Inicio</a>
            <a href="articulos.html" class="mobile-link"><i class="fas fa-book-open"></i> Artículos</a>
            <a href="guias.html" class="mobile-link"><i class="fas fa-book"></i> Guías</a>
            <a href="sobre-nosotros.html" class="mobile-link"><i class="fas fa-users"></i> Nosotros</a>
            <div class="menu-title">Mi Cuenta</div>
            <a href="#" class="mobile-link"><i class="fas fa-user"></i> Perfil (${user.name})</a>
            <a href="#" class="mobile-link" id="mobileLogoutBtn"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
        `;
        document.getElementById('mobileLogoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            AuthService.logout();
        });
    } else {
        mobileLinks.innerHTML = `
            <div class="menu-title">Menú Principal</div>
            <a href="index.html" class="mobile-link"><i class="fas fa-home"></i> Inicio</a>
            <a href="articulos.html" class="mobile-link"><i class="fas fa-book-open"></i> Artículos</a>
            <a href="guias.html" class="mobile-link"><i class="fas fa-book"></i> Guías</a>
            <a href="sobre-nosotros.html" class="mobile-link"><i class="fas fa-users"></i> Nosotros</a>
            <div class="menu-title">Acceso</div>
            <a href="login.html" class="mobile-link"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</a>
            <a href="registro.html" class="mobile-link"><i class="fas fa-user-plus"></i> Registrarse</a>
        `;
    }
}

function initHeader() {
    const menuToggle = document.querySelector('.site-header .menu-toggle');
    const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;
    const mobilePanel = document.getElementById('mobilePanel');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (menuToggle && mobilePanel) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = mobilePanel.classList.contains('open');
            
            if (isOpen) {
                mobilePanel.classList.remove('open');
                document.body.style.overflow = '';
                menuToggle.setAttribute('aria-expanded', 'false');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars');
                }
            } else {
                mobilePanel.classList.add('open');
                document.body.style.overflow = 'hidden';
                menuToggle.setAttribute('aria-expanded', 'true');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-xmark');
                }
            }
        });
    }

    if (mobilePanel) {
        mobilePanel.addEventListener('click', (e) => {
            // Close button click inside panel (optional if header button is used)
            if (e.target.closest('.close-menu')) {
                e.preventDefault();
                mobilePanel.classList.remove('open');
                document.body.style.overflow = '';
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    if (menuIcon) {
                        menuIcon.classList.remove('fa-xmark');
                        menuIcon.classList.add('fa-bars');
                    }
                }
            }
            
            // Link click
            if (e.target.closest('.mobile-link')) {
                mobilePanel.classList.remove('open');
                document.body.style.overflow = '';
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    if (menuIcon) {
                        menuIcon.classList.remove('fa-xmark');
                        menuIcon.classList.add('fa-bars');
                    }
                }
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobilePanel && mobilePanel.classList.contains('open')) {
            mobilePanel.classList.remove('open');
            document.body.style.overflow = '';
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars');
                }
            }
        }
    });

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Close other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('open');
                });
                dropdown.classList.toggle('open');
            });
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(d => d.classList.remove('open'));
        }
    });

    // Notifications logic (from site-header.js)
    const notificationBtns = document.querySelectorAll('.open-notifications');
    notificationBtns.forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            if (window.openNotificationsModal) {
                window.openNotificationsModal();
            }
        });
    });
}

function initGuidesLogic() {
    const searchInput = document.getElementById('guidesPublicSearchInput');
    const topicFilter = document.getElementById('topicFilter');
    const sortFilter = document.getElementById('sortFilter');
    const applyBtn = document.getElementById('applyFiltersBtn');
    const container = document.getElementById('guidesContainer');
    const emptyResult = document.getElementById('guidesEmptyResult');
    
    if (!container) return;

    const cards = Array.from(container.getElementsByClassName('guide-card'));

    function filterAndSort() {
        const query = searchInput.value.toLowerCase();
        const selectedTopic = topicFilter.value;
        const selectedSort = sortFilter.value;

        let visibleCount = 0;

        const filteredCards = cards.filter(card => {
            const title = card.querySelector('.guide-title').textContent.toLowerCase();
            const author = card.querySelector('.guide-author').textContent.toLowerCase();
            const topic = card.getAttribute('data-topic');

            const matchesSearch = title.includes(query) || author.includes(query);
            const matchesTopic = selectedTopic === 'todos' || topic === selectedTopic;

            const isVisible = matchesSearch && matchesTopic;
            card.style.display = isVisible ? 'flex' : 'none';
            if (isVisible) visibleCount++;
            return isVisible;
        });

        filteredCards.sort((a, b) => {
            if (selectedSort === 'vistas') {
                return parseInt(b.getAttribute('data-views')) - parseInt(a.getAttribute('data-views'));
            } else if (selectedSort === 'descargas') {
                return parseInt(b.getAttribute('data-downloads')) - parseInt(a.getAttribute('data-downloads'));
            } else {
                return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
            }
        });

        filteredCards.forEach(card => container.appendChild(card));

        emptyResult.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterAndSort);
    }

    if (applyBtn) {
        applyBtn.addEventListener('click', filterAndSort);
    }
}

// Lógica de Artículos (Filtrado y Búsqueda)
function initArticlesLogic() {
    const searchInput = document.getElementById('articlesPublicSearchInput');
    const topicFilter = document.getElementById('articleTopicFilter');
    const sortFilter = document.getElementById('articleSortFilter');
    const applyBtn = document.getElementById('applyArticleFiltersBtn');
    const container = document.getElementById('articlesContainer');
    
    if (!container) return;

    const cards = Array.from(container.getElementsByClassName('article-card'));

    function filterAndSort() {
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedTopic = topicFilter ? topicFilter.value : 'todos';
        const selectedSort = sortFilter ? sortFilter.value : 'fecha';

        let visibleCount = 0;

        // Filtrado
        const filteredCards = cards.filter(card => {
            const title = card.querySelector('.article-title').textContent.toLowerCase();
            const author = card.querySelector('.article-author').textContent.toLowerCase();
            const topic = card.getAttribute('data-topic');

            const matchesSearch = title.includes(query) || author.includes(query);
            const matchesTopic = selectedTopic === 'todos' || topic === selectedTopic;

            const isVisible = matchesSearch && matchesTopic;
            card.style.display = isVisible ? 'flex' : 'none';
            if (isVisible) visibleCount++;
            return isVisible;
        });

        // Ordenamiento
        filteredCards.sort((a, b) => {
            if (selectedSort === 'vistas') {
                return parseInt(b.getAttribute('data-views')) - parseInt(a.getAttribute('data-views'));
            } else {
                return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
            }
        });

        // Reordenar en el DOM
        filteredCards.forEach(card => container.appendChild(card));
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterAndSort);
    }

    if (applyBtn) {
        applyBtn.addEventListener('click', filterAndSort);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    updateNavbar();
    updateMobileNavbar();
    initGuidesLogic();
    initArticlesLogic();

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showAlert('Las contraseñas no coinciden.', 'error');
                return;
            }

            const result = AuthService.register(name, email, password);
            if (result.success) {
                showAlert(result.message, 'success');
                setTimeout(() => window.location.href = 'login.html', 1500);
            } else {
                showAlert(result.message, 'error');
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const result = AuthService.login(email, password);
            if (result.success) {
                showAlert(result.message, 'success');
                setTimeout(() => window.location.href = 'index.html', 1000);
            } else {
                showAlert(result.message, 'error');
            }
        });
    }

    window.togglePassword = function(inputId) {
        const input = document.getElementById(inputId);
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
    };
});
