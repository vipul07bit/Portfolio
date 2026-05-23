gsap.registerPlugin(ScrollTrigger);

const video = document.getElementById("bg-video");
let proxy = { time: 0 };

video.addEventListener("loadeddata", () => {
    let vidDuration = isNaN(video.duration) || video.duration === Infinity ? 10 : video.duration;

    let tl = gsap.timeline({
        scrollTrigger: {
            // TRIGGER CHANGED: We now pin the entire hero section
            trigger: ".hero", 
            start: "top top",
            end: "+=400%", // Require 5 screens of scrolling to finish video
            pin: true,     // Locks the hero section on screen
            scrub: 2     // Smooth buttery scrub
        }
    });

    // 1. THE VIDEO SCRUBBING
    tl.to(proxy, {
        time: vidDuration,
        ease: "none",
        duration: 100, 
        onUpdate: () => {
            if (video.readyState >= 2) {
                video.currentTime = proxy.time;
            }
        }
    }, 0); 

    // 2. THE FAST ZOOM (0% to 40%)
    // Scales up to 1.25x
    tl.to(video, {
        scale: 1.25, 
        ease: "power1.inOut", 
        duration: 40
    }, 0); 

    // 3. THE SLOW ZOOM (40% to 100%)
    // Slowly creeps from 1.25x up to the final 1.35x limit
    tl.to(video, {
        scale: 1.35, 
        ease: "none", 
        duration: 60
    }, 40); 
});

video.load();
video.pause();