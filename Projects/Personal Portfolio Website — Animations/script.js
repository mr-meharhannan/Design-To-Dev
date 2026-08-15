//
// ═════════════════════════════════════════════════════════════════════
// PORTFOLIO WEBSITE - ANIMATION & INTERACTION SCRIPT
// ═════════════════════════════════════════════════════════════════════
//
// Yeh script mein website ke animations aur interactive features shamil hain:
// 1. Scroll reveal animations - Jab user scroll karey to elements fade/slide in
// 2. Cursor-follow effect - Experience section mein mouse ke sath image chaltee hai
//

//
// MAIN FUNCTIONALITY - DOM load hone ke baad chhalo
// DOMContentLoaded = jab HTML fully load ho jaye to yeh function chhale
//
document.addEventListener("DOMContentLoaded", function () {
    
    //
    // SCROLL REVEAL ANIMATIONS SETUP
    // ═════════════════════════════════════════════════════════════════
    // Yeh array mein har element aur uska animation type likha hai
    // Jab user scroll karey to ye elements animation ke sath appear hote hain
    //
    const revealMap = [
        [".header", "reveal-fade"],                              // Header fade in hota hai
        [".hero .text span", "reveal-up"],                       // Hero text upar se slide in
        [".hero .menu1", "reveal-up"],                           // Menu1 upar se aata hai
        [".hero .menu2 > div", "reveal-fade"],                   // Social buttons fade in
        [".portfolio", "reveal-fade"],                           // Portfolio section fade
        [".work .filters", "reveal-fade"],                       // Work filters fade
        [".work .project", "reveal-scale"],                      // Projects zoom in
        [".service-section", "reveal-fade"],                     // Service heading fade
        [".service .service-content .service", "reveal-up"],     // Service cards slide up
        [".ex-section .experience-section", "reveal-fade"],      // Experience heading fade
        [".ex-section .experience", "reveal-up"],                // Experience items slide up
        [".letswork", "reveal-fade"],                            // CTA section fade
        [".letswork .social .link", "reveal-up"],                // Social links slide up
        ["footer", "reveal-fade"]                                // Footer fade in
    ];

    //
    // ACCESSIBILITY CHECK - User ne motion prefer nahi kiya?
    // prefers-reduced-motion = agar user ka accessibility setting "no motion" ho
    //
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = [];

    //
    // ANIMATION APPLICATION LOOP
    // Har element ke liye animation class add karo
    // aur delay set karo takey nicely stagger effect bane
    //
    revealMap.forEach(([selector, animationClass]) => {
        // Tamma elements ko find karo jo is selector match karti ho
        document.querySelectorAll(selector).forEach((element, index) => {
            // Animation class add karo
            element.classList.add(animationClass);
            
            // Delay set karo - har element thora zyada time baad animate hoga
            // Math.min = max 420ms delay rakhne k liye (takey bohot acha effect rahe)
            element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
            
            // Array mein add karo takey baad mein sab ko "visible" class de saken
            revealTargets.push(element);
        });
    });

    //
    // MOTION PREFERENCE HANDLING
    // Agar user ko motion pasand nahi to sab animations directly show kar do
    // Agar motion pasand hai to requestAnimationFrame se smooth trigger karo
    //
    if (prefersReducedMotion) {
        // Motion pasand nahi - directly visible karo
        revealTargets.forEach((element) => element.classList.add("is-visible"));
    } else {
        // Motion pasand hai - smooth animation ke sath show karo
        // requestAnimationFrame = next frame par function run karo (smooth hota hai)
        window.requestAnimationFrame(() => {
            revealTargets.forEach((element) => element.classList.add("is-visible"));
        });
    }

    //
    // ═════════════════════════════════════════════════════════════════
    // CURSOR-FOLLOW EFFECT FOR EXPERIENCE SECTION
    // ═════════════════════════════════════════════════════════════════
    // Experience section par hover karte waqt floating image
    // mouse ke sath chaltee hai
    //

    // Experience section aur floating image ko select karo
    const section = document.querySelector(".ex-section");
    const image = document.querySelector(".cursor-follow");

    // Agar ye dono elements nahi mile to function yahan ruke (error avoid karne k liye)
    if (!section || !image) return;

    //
    // MOUSE ENTER - Jab mouse section mein aaye
    // Floating image ko visible karo (opacity = 1)
    //
    section.addEventListener("mouseenter", function () {
        image.style.opacity = "1";
    });

    //
    // MOUSE MOVE - Jab mouse move karey section mein
    // Image ko mouse position ke exact sath place karo
    // event.clientX/clientY = mouse ki exact position screen par
    //
    section.addEventListener("mousemove", function (event) {
        // Mouse ki X position (left se distance)
        const x = event.clientX;
        // Mouse ki Y position (top se distance)
        const y = event.clientY;

        // Image ko X position par set karo
        image.style.left = x + "px";
        // Image ko Y position par set karo
        image.style.top = y + "px";
    });

    //
    // MOUSE LEAVE - Jab mouse section se bahar chale
    // Floating image ko invisible karo (opacity = 0)
    //
    section.addEventListener("mouseleave", function () {
        image.style.opacity = "0";
    });
});
