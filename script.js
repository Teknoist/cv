// Lamba tıklama – karanlık/aydınlık geçişi
const body = document.body;
const cv   = document.getElementById("cv");
const bulb = document.querySelector(".bulb");

document.getElementById("lamp").addEventListener("click", () => {
  body.classList.toggle("light");
  if (body.classList.contains("light")) {
    cv.classList.remove("hidden");
    document.getElementById("bats-container").style.display = "none";
  } else {
    cv.classList.add("hidden");
    document.getElementById("bats-container").style.display = "block";
  }
});

// Yarasaların başlangıç konumlarını rastgele ayarla
document.querySelectorAll(".bat").forEach(bat => {
  bat.style.top = Math.random() * 90 + "%";
  bat.style.left = Math.random() * 90 + "%";
  bat.style.animationDelay = (Math.random() * 5) + "s";
});
