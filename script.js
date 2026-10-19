
document.documentElement.classList.add("js-ready");

// 1. Tahun otomatis pada footer
document.getElementById("currentYear").textContent =
  new Date().getFullYear();

// 2. Indikator progres saat halaman digulir
const progressTrack = document.getElementById("progressTrack");

function updateProgress() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = scrollableHeight > 0
    ? (window.scrollY / scrollableHeight) * 100
    : 0;

  progressTrack.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// 3. Navigasi responsif untuk tampilan HP
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Tutup navigasi" : "Buka navigasi"
  );
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka navigasi");
  });
});

// 4. Filter kategori pada bagian karya
const filterButtons = document.querySelectorAll(".filter-button");
const workCards = document.querySelectorAll(".work-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;

      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    workCards.forEach((card) => {
      const matchesCategory =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;

      card.hidden = !matchesCategory;
    });
  });
});

// 5. Animasi elemen ketika masuk ke layar
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

// 6. Notifikasi singkat
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// 7. Tombol untuk menyalin pesan pembuka
const copyMessageButton = document.getElementById("copyMessage");

copyMessageButton.addEventListener("click", async () => {
  const message =
    "Halo, saya ingin berdiskusi tentang sebuah proyek digital. Apakah kita bisa menjadwalkan percakapan singkat?";

  try {
    await navigator.clipboard.writeText(message);
    showToast("Pesan pembuka berhasil disalin.");
  } catch (error) {
    // Fallback bila akses Clipboard API tidak tersedia
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = message;
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";

    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    const copied = document.execCommand("copy");
    temporaryInput.remove();

    showToast(
      copied
        ? "Pesan pembuka berhasil disalin."
        : "Penyalinan gagal. Coba jalankan ulang di browser."
    );
  }
});
