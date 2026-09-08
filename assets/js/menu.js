document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        const icon = menuBtn.querySelector('i');

        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });
    }
});
