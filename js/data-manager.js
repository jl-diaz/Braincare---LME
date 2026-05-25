// DataManager - Robust localStorage data management
const DataManager = {
    // Storage keys
    KEYS: {
        USERS: 'braincare_users',
        CURRENT_USER: 'braincare_currentUser',
        ARTICLES: 'braincare_articles',
        GUIDES: 'braincare_guides',
        BOOKMARKS: 'braincare_bookmarks',
        READ_LATER: 'braincare_readLater',
        HISTORY: 'braincare_history'
    },

    // Default data for articles and guides
    defaultData: {
        articles: [
            {
                id: '1',
                title: 'Cómo mejorar tu autoestima',
                topic: 'Recomendaciones',
                author: 'Equipo BrainCare',
                date: '2024-03-15',
                views: 1240,
                excerpt: 'Descubre técnicas prácticas para fortalecer tu autoestima y mejorar tu bienestar emocional.',
                content: '<p>La autoestima es fundamental para nuestro bienestar emocional...</p>',
                image: 'img/Autoestima.jpg'
            },
            {
                id: '2',
                title: 'Manejo de la ansiedad en el día a día',
                topic: 'Tratamientos',
                author: 'Dr. Smith',
                date: '2024-03-10',
                views: 850,
                excerpt: 'Herramientas prácticas para gestionar la ansiedad en situaciones cotidianas.',
                content: '<p>La ansiedad es una respuesta natural del cuerpo...</p>',
                image: 'img/Ansiedad.jpeg'
            },
            {
                id: '3',
                title: 'Nuevos hallazgos sobre la depresión',
                topic: 'Investigacion',
                author: 'Investigación BrainCare',
                date: '2024-03-05',
                views: 2100,
                excerpt: 'Los últimos avances en la comprensión de la depresión.',
                content: '<p>La investigación reciente ha revelado...</p>',
                image: 'img/depresion.jpeg'
            }
        ],
        guides: [
            {
                id: '1',
                title: 'Guía para una meditación efectiva',
                topic: 'Recomendaciones',
                author: 'BrainCare Team',
                views: 1200,
                downloads: 450,
                date: '2024-03-15',
                excerpt: 'Aprende técnicas de meditación para reducir el estrés.',
                content: '<p>La meditación es una herramienta poderosa...</p>',
                image: 'img/cooki/co.png'
            },
            {
                id: '2',
                title: 'Primeros pasos tras un diagnóstico',
                topic: 'Tratamientos',
                author: 'Dr. Smith',
                views: 850,
                downloads: 320,
                date: '2024-03-10',
                excerpt: 'Una guía para navegar los primeros pasos después de un diagnóstico.',
                content: '<p>Recibir un diagnóstico puede ser abrumador...</p>',
                image: 'img/cooki/CWF.png'
            },
            {
                id: '3',
                title: 'Gestión del tiempo y salud mental',
                topic: 'Prevencion',
                author: 'BrainCare Team',
                views: 2100,
                downloads: 980,
                date: '2024-03-05',
                excerpt: 'Estrategias para equilibrar productividad y salud mental.',
                content: '<p>El tiempo es un recurso valioso...</p>',
                image: 'img/cooki/perrito medico.png'
            }
        ]
    },

    // Helper methods for localStorage
    _getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },

    _setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },

    _removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },

    // Initialize default data if not exists
    init() {
        if (!this._getItem(this.KEYS.ARTICLES)) {
            this._setItem(this.KEYS.ARTICLES, this.defaultData.articles);
        }
        if (!this._getItem(this.KEYS.GUIDES)) {
            this._setItem(this.KEYS.GUIDES, this.defaultData.guides);
        }
    },

    // Articles CRUD operations
    getArticles(filters = {}) {
        let articles = this._getItem(this.KEYS.ARTICLES) || [];
        
        // Apply filters
        if (filters.topic && filters.topic !== 'todos') {
            articles = articles.filter(a => a.topic === filters.topic);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            articles = articles.filter(a => 
                a.title.toLowerCase().includes(search) || 
                a.author.toLowerCase().includes(search)
            );
        }
        
        // Apply sorting
        if (filters.sort) {
            switch (filters.sort) {
                case 'vistas':
                    articles.sort((a, b) => b.views - a.views);
                    break;
                case 'fecha':
                default:
                    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
        }
        
        return articles;
    },

    getArticle(id) {
        const articles = this._getItem(this.KEYS.ARTICLES) || [];
        const article = articles.find(a => a.id === id);
        
        // Increment view count
        if (article) {
            article.views++;
            this._setItem(this.KEYS.ARTICLES, articles);
        }
        
        return article;
    },

    addArticle(article) {
        const articles = this._getItem(this.KEYS.ARTICLES) || [];
        article.id = Date.now().toString();
        article.date = new Date().toISOString().split('T')[0];
        article.views = 0;
        articles.push(article);
        return this._setItem(this.KEYS.ARTICLES, articles);
    },

    updateArticle(id, updatedData) {
        const articles = this._getItem(this.KEYS.ARTICLES) || [];
        const index = articles.findIndex(a => a.id === id);
        if (index !== -1) {
            articles[index] = { ...articles[index], ...updatedData };
            return this._setItem(this.KEYS.ARTICLES, articles);
        }
        return false;
    },

    deleteArticle(id) {
        let articles = this._getItem(this.KEYS.ARTICLES) || [];
        articles = articles.filter(a => a.id !== id);
        return this._setItem(this.KEYS.ARTICLES, articles);
    },

    // Guides CRUD operations
    getGuides(filters = {}) {
        let guides = this._getItem(this.KEYS.GUIDES) || [];
        
        // Apply filters
        if (filters.topic && filters.topic !== 'todos') {
            guides = guides.filter(g => g.topic === filters.topic);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            guides = guides.filter(g => 
                g.title.toLowerCase().includes(search) || 
                g.author.toLowerCase().includes(search)
            );
        }
        
        // Apply sorting
        if (filters.sort) {
            switch (filters.sort) {
                case 'vistas':
                    guides.sort((a, b) => b.views - a.views);
                    break;
                case 'descargas':
                    guides.sort((a, b) => b.downloads - a.downloads);
                    break;
                case 'fecha':
                default:
                    guides.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
        }
        
        return guides;
    },

    getGuide(id) {
        const guides = this._getItem(this.KEYS.GUIDES) || [];
        const guide = guides.find(g => g.id === id);
        
        // Increment view count
        if (guide) {
            guide.views++;
            this._setItem(this.KEYS.GUIDES, guides);
        }
        
        return guide;
    },

    addGuide(guide) {
        const guides = this._getItem(this.KEYS.GUIDES) || [];
        guide.id = Date.now().toString();
        guide.date = new Date().toISOString().split('T')[0];
        guide.views = 0;
        guide.downloads = 0;
        guides.push(guide);
        return this._setItem(this.KEYS.GUIDES, guides);
    },

    // User bookmarks management
    getBookmarks(userId) {
        const bookmarks = this._getItem(this.KEYS.BOOKMARKS) || {};
        return bookmarks[userId] || [];
    },

    addBookmark(userId, itemId, itemType) {
        const bookmarks = this._getItem(this.KEYS.BOOKMARKS) || {};
        if (!bookmarks[userId]) bookmarks[userId] = [];
        bookmarks[userId].push({ id: itemId, type: itemType });
        return this._setItem(this.KEYS.BOOKMARKS, bookmarks);
    },

    removeBookmark(userId, itemId) {
        const bookmarks = this._getItem(this.KEYS.BOOKMARKS) || {};
        if (bookmarks[userId]) {
            bookmarks[userId] = bookmarks[userId].filter(b => b.id !== itemId);
        }
        return this._setItem(this.KEYS.BOOKMARKS, bookmarks);
    },

    // Reading history
    addToHistory(userId, itemId, itemType) {
        const history = this._getItem(this.KEYS.HISTORY) || {};
        if (!history[userId]) history[userId] = [];
        history[userId].unshift({ 
            id: itemId, 
            type: itemType, 
            date: new Date().toISOString() 
        });
        // Keep only last 50 items
        history[userId] = history[userId].slice(0, 50);
        return this._setItem(this.KEYS.HISTORY, history);
    },

    getHistory(userId) {
        const history = this._getItem(this.KEYS.HISTORY) || {};
        return history[userId] || [];
    },

    // Clear all data (useful for development)
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            this._removeItem(key);
        });
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    DataManager.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}