/**
 * components-loader.js
 * Carregador modular de componentes para o Duck Stack.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const isInsidePages = window.location.pathname.includes('/views/');
    const prefix = isInsidePages ? '../../' : './';

    const components = [
        { id: 'component-header', file: 'src/components/header.html' },
        { id: 'component-sobre', file: 'src/components/sobre.html' },
        { id: 'component-skills', file: 'src/components/skills.html' },
        { id: 'component-projects', file: 'src/components/projects.html' },
        { id: 'component-trajetoria', file: 'src/components/trajetoria.html' },
        { id: 'component-contact', file: 'src/components/contact.html' },
        { id: 'component-footer', file: 'src/components/footer.html' },
        { id: 'component-modals', file: 'src/components/modals.html' }
    ];

    for (const comp of components) {
        const el = document.getElementById(comp.id);
        if (el) {
            try {
                const res = await fetch(prefix + comp.file);
                if (res.ok) {
                    el.innerHTML = await res.text();
                }
            } catch (e) {
                // Fallback local file://
            }
        }
    }
});
