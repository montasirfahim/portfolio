AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: false,
    mirror: true,
    offset: 100
});

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    const highlightActiveLink = () => {
        let current = "";
        
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").slice(1) === current) {
                link.classList.add("active");
            }
        });
    };

    highlightActiveLink();
    
    window.addEventListener("scroll", highlightActiveLink);
    
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").slice(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth" });
                const hamburger = document.querySelector(".hamburger");
                const navLinksList = document.querySelector(".nav-links");
                if (hamburger && navLinksList) {
                    navLinksList.classList.remove("flex");
                    navLinksList.classList.add("hidden");
                }
            }
        });
    });
});

const hamburger = document.querySelector(".hamburger");
const navLinksList = document.querySelector(".nav-links");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        if (navLinksList.classList.contains("hidden")) {
            navLinksList.classList.remove("hidden");
            navLinksList.classList.add("flex", "absolute", "top-20", "left-0", "w-full", "flex-col", "bg-slate-950/95", "backdrop-blur-md", "border-b", "border-cyan-500/20", "z-40");
        } else {
            navLinksList.classList.add("hidden");
            navLinksList.classList.remove("flex", "absolute", "top-20", "left-0", "w-full", "flex-col", "bg-slate-950/95", "backdrop-blur-md", "border-b", "border-cyan-500/20", "z-40");
        }
    });
}

function forceDownload() {
    const link = document.createElement('a');
    link.href = 'assets/resume.pdf';
    link.download = 'Montasir_Fahim_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}