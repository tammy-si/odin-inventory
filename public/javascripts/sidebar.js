// for changing the side bar links active
document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener("click", () => {
        // remove all other actives
        document.querySelectorAll('.nav-link').forEach((b) => {
            b.classList.remove('active');
        })
        btn.classList.add("active");
    });
});