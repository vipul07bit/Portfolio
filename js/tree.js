document.addEventListener("DOMContentLoaded", () => {
    // 1. Register the GSAP Plugins you included in your HTML
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    const container = document.querySelector(".skills-timeline-container");
    const svg = document.querySelector("#fluid-svg");
    const bgConduit = document.querySelector("#bg-conduit");
    const liquidFlow = document.querySelector("#liquid-flow");
    const spark = document.querySelector("#energy-spark");
    const cards = document.querySelectorAll(".skill-card");

    // 2. Dynamically draw a straight "tech spine" path down the middle
    function setupPath() {
        // Get the height of the container so the line goes all the way down
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const midX = width / 2;

        // Set SVG canvas dimensions
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

        // Draw a straight line directly down the middle
        const pathString = `M ${midX} 0 L ${midX} ${height}`;
        
        bgConduit.setAttribute("d", pathString);
        liquidFlow.setAttribute("d", pathString);

        // Calculate length for the "drawing" animation
        const pathLength = liquidFlow.getTotalLength();
        gsap.set(liquidFlow, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
        });

        return pathLength;
    }

    // Initialize the path
    setupPath();

    // 3. Create the Main Scroll Animation Timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".skills-timeline-container",
            start: "top 60%",     // Starts when container hits 60% of the screen
            end: "bottom 80%",    // Ends near the bottom of the container
            scrub: 1,             // Smoothly ties the animation to the scrollbar
        }
    });

    // Animate the colored liquid line drawing downwards
    tl.to(liquidFlow, {
        strokeDashoffset: 0,
        ease: "none"
    }, 0);

    // Animate the glowing spark following the exact same path
    tl.to(spark, {
        motionPath: {
            path: liquidFlow,
            align: liquidFlow,
            alignOrigin: [0.5, 0.5]
        },
        ease: "none"
    }, 0);

    // 4. Showcase Cards when the scroll reaches them
    cards.forEach((card) => {
        ScrollTrigger.create({
            trigger: card,
            start: "top 55%", // Triggers when the card enters the middle of the screen
            onEnter: () => card.classList.add("active"),
            onLeaveBack: () => card.classList.remove("active"), // Removes glow if you scroll back up
        });
    });

    // 5. Ensure everything stays aligned if the user resizes their browser window
    window.addEventListener("resize", () => {
        setupPath();
        ScrollTrigger.refresh();
    });
});