// DOMContentLoaded, sayfa tamamen yüklendiğinde çalışır
document.addEventListener('DOMContentLoaded', function() {
    // Sosyal medya ikonlarına hover (fare üzerine geldiğinde) efekti ekle
    const socialLinks = document.querySelectorAll('.social-links a');

    socialLinks.forEach(link => {
        link.addEventListener('mouseover', function() {
            this.style.color = '#ff8c00';
        });

        link.addEventListener('mouseout', function() {
            this.style.color = 'white';
        });
    });

    // Sayfa kaydırıldığında başlıkları animasyonla göster
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', function() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            const triggerPoint = window.innerHeight - sectionHeight / 3;

            if (sectionTop < triggerPoint) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            } else {
                section.style.opacity = '0';
                section.style.transform = 'translateY(50px)';
            }
        });
    });
});
