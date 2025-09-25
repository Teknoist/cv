const {
  gsap,
  gsap: { registerPlugin, set, to, timeline },
  MorphSVGPlugin,
  Draggable } =
window;
registerPlugin(MorphSVGPlugin);

// DOM Elementleri
const HIT = document.querySelector('.lamp__hit');
const DUMMY_CORD = document.querySelector('.cord--dummy');
const CORDS = gsap.utils.toArray('.cords path');

// Işık ve İçerik Kontrol Elementleri
const CONTENT_WRAPPER = document.querySelector('#content-wrapper');
const BAT_OVERLAY = document.querySelector('#bat-overlay');

// GSAP Ayarları
const CORD_DURATION = 0.1;
const ENDX = DUMMY_CORD.getAttribute('x2');
const ENDY = DUMMY_CORD.getAttribute('y2');
const PROXY = document.createElement('div');
const STATE = { ON: false };

// Başlangıç Değerlerini Ayarla
const RESET = () => {
  set(PROXY, { x: ENDX, y: ENDY });
};
RESET();

// Lamba Gözlerinin ve Kablonun Başlangıç Ayarları
gsap.set(['.cords', HIT], { x: -10 });
gsap.set('.lamp__eye', { rotate: 180, transformOrigin: '50% 50%', yPercent: 50 });

// LAMBA ANİMASYON ZAMAN ÇİZELGESİ
const CORD_TL = timeline({
  paused: true,
  onStart: () => {
    STATE.ON = !STATE.ON;
    
    // Işık Durumuna Göre CSS Değişkenini Güncelle (style.css'te kullanılır)
    set(document.documentElement, { '--on': STATE.ON ? 1 : 0 });

    // Işık Açma/Kapama Sesini Çal (Ses URL'si CDN'den alınmıştır)
    const audio = new Audio('https://assets.codepen.io/605876/click.mp3');
    audio.play();

    // Lamba Gözlerini Döndür (Işık kapalıyken üzgün, açıkken mutlu)
    set('.lamp__eye', { rotate: STATE.ON ? 0 : 180 });

    // Dummy Cord'u Gizle/Göster
    set([DUMMY_CORD, HIT], { display: 'none' });
    set(CORDS[0], { display: 'block' });
    
    // --- SİTE İÇERİĞİ VE YARASA KONTROLÜ ---
    if (STATE.ON) {
      // IŞIK AÇIK: Yarasaları kaybet, içeriği göster
      gsap.to(BAT_OVERLAY, { duration: 0.5, opacity: 0, scale: 0.8, ease: 'power2.in' });
      // İçerik opaklığı ve parlaklığı CSS değişkenleriyle style.css'te yönetildiği için burada sadece transform kullanılır.
      // İçerik görünürlüğü CSS'e bırakılmıştır.
    } else {
      // IŞIK KAPALI: Yarasaları göster, içeriği karart
      gsap.to(BAT_OVERLAY, { duration: 1, opacity: 1, scale: 1, ease: 'power2.out' });
    }
    // --- KONTROL SONU ---
  },
  onComplete: () => {
    // Animasyon bitince Dummy Cord'u tekrar etkinleştir
    set([DUMMY_CORD, HIT], { display: 'block' });
    set(CORDS[0], { display: 'none' });
    RESET();
  } 
});

// Kablonun Uzayıp Kısalma Animasyonu
for (let i = 1; i < CORDS.length; i++) {
  CORD_TL.add(
    to(CORDS[0], {
      morphSVG: CORDS[i],
      duration: CORD_DURATION,
      repeat: 1,
      yoyo: true 
    })
  );
}

// Draggable Entegrasyonu (Fare/Dokunmatik ile çekme)
Draggable.create(PROXY, {
  trigger: HIT,
  type: 'x,y',
  onDrag: function () {
    // Sadece aşağı çekme hareketiyle ipin çizilmesini sağlar
    set(DUMMY_CORD, {
      attr: {
        x2: this.x,
        y2: Math.max(this.y, 45) // Yüksekliği sınırlama
      }
    });
  },
  onRelease: function () {
    // Kablonun ne kadar çekildiğini kontrol eder
    const DY = this.y - ENDY;
    if (DY > 50) { // 50 birimden fazla çekilmişse
      CORD_TL.restart();
    } else {
      // Yeterince çekilmemişse kabloyu geri getir
      to(DUMMY_CORD, {
        attr: { x2: ENDX, y2: ENDY },
        duration: CORD_DURATION * 5,
        ease: 'elastic.out(1, 0.5)'
      });
    }
  }
});
