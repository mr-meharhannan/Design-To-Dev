document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".ex-section");
    const image = document.querySelector(".cursor-follow");

    section.addEventListener("mouseenter", function () {
        image.style.opacity = "1";
    });

    section.addEventListener("mousemove", function (event) {
        const x = event.clientX;
        const y = event.clientY;

        image.style.left = x + "px";
        image.style.top = y + "px";
    });

    section.addEventListener("mouseleave", function () {
        image.style.opacity = "0";
    });
});
