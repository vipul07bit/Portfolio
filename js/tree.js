document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  const container = document.querySelector(".skills-timeline-container");
  const svg = document.querySelector("#fluid-svg");
  const bgConduit = document.querySelector("#bg-conduit");
  const liquidFlow = document.querySelector("#liquid-flow");
  const spark = document.querySelector("#energy-spark");
  const cards = document.querySelectorAll(".skill-card");

  function buildFluidTrack() {
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    svg.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);

    const isMobile = window.innerWidth <= 768;
    const pathCenterX = isMobile ? 30 : containerWidth / 2;

    let pathString = `M ${pathCenterX} 0 `;

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardTopRelative = cardRect.top - containerRect.top;
      const cardMiddleY = cardTopRelative + (cardRect.height / 2);

      // Plot smooth path down to card midpoint
      pathString += `L ${pathCenterX} ${cardMiddleY - 30} `;
      
      if (isMobile) {
        pathString += `C ${pathCenterX} ${cardMiddleY - 10}, ${pathCenterX + 10} ${cardMiddleY}, ${pathCenterX + 20} ${cardMiddleY} `;
        pathString += `L ${pathCenterX + 20} ${cardMiddleY} `;
        pathString += `L ${pathCenterX} ${cardMiddleY} `; 
      } else {
        if(card.classList.contains('checkpoint-card')) {
          // Checkpoint logic: straight down through center item
          pathString += `L ${pathCenterX} ${cardMiddleY} `;
        } else {
          // Alternate Left/Right branch logic
          const isLeftCard = card.closest(".row-left") !== null;
          const targetX = isLeftCard ? (cardRect.right - containerRect.left) : (cardRect.left - containerRect.left);
          
          pathString += `C ${pathCenterX} ${cardMiddleY - 15}, ${targetX} ${cardMiddleY - 15}, ${targetX} ${cardMiddleY} `;
          pathString += `C ${targetX} ${cardMiddleY + 15}, ${pathCenterX} ${cardMiddleY + 15}, ${pathCenterX} ${cardMiddleY + 30} `;
        }
      }
    });

    pathString += `L ${pathCenterX} ${containerHeight}`;

    bgConduit.setAttribute("d", pathString);
    liquidFlow.setAttribute("d", pathString);

    const totalPathLength = liquidFlow.getTotalLength();
    gsap.set(liquidFlow, {
      strokeDasharray: totalPathLength,
      strokeDashoffset: totalPathLength
    });

    createScrollAnimations(totalPathLength);
  }

  function createScrollAnimations(pathLength) {
    ScrollTrigger.getAll().forEach(t => t.kill());

    // Master execution stream timeline
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".skills-timeline-container",
        start: "top 35%",
        end: "bottom 75%",
        scrub: 1.2,
      }
    });

    scrollTimeline.to(liquidFlow, {
      strokeDashoffset: 0,
      ease: "none"
    }, 0);

    scrollTimeline.to(spark, {
      motionPath: {
        path: liquidFlow,
        align: liquidFlow,
        alignOrigin: [0.5, 0.5]
      },
      ease: "none"
    }, 0);

    // Pinpoint Active Card States based directly on spark coordinates tracking 
    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 50%", // Tighter visual window triggers right as spark hits card
        end: "bottom 30%",
        onEnter: () => card.classList.add("active"),
        onLeaveBack: () => card.classList.remove("active"),
        onEnterBack: () => card.classList.add("active"),
        onLeave: () => card.classList.remove("active")
      });
    });
  }

  buildFluidTrack();

  window.addEventListener("resize", () => {
    gsap.delayedCall(0.1, buildFluidTrack);
  });
});