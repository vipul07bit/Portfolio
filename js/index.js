gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const video = document.getElementById("bg-video");
let proxy = { time: 0 };

function setupHeroVideoScroll() {
  if (!video) return;

  video.addEventListener("loadeddata", () => {
    const vidDuration =
      isNaN(video.duration) || video.duration === Infinity ? 10 : video.duration;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 2
      }
    });

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

    tl.to(video, {
      scale: 1.25,
      ease: "power1.inOut",
      duration: 40
    }, 0);

    tl.to(video, {
      scale: 1.35,
      ease: "none",
      duration: 60
    }, 40);
  });

  video.load();
  video.pause();
}

function initMindmap(root) {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  const container = root.querySelector(".skills-timeline-container");
  const svg = root.querySelector("#fluid-svg");
  const bgConduit = root.querySelector("#bg-conduit");
  const liquidFlow = root.querySelector("#liquid-flow");
  const spark = root.querySelector("#energy-spark");
  const cards = root.querySelectorAll(".skill-card");

  if (!container || !svg || !bgConduit || !liquidFlow || !spark) return;

  function setupPath() {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const midX = width / 2;

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const pathString = `M ${midX} 0 L ${midX} ${height}`;
    bgConduit.setAttribute("d", pathString);
    liquidFlow.setAttribute("d", pathString);

    const pathLength = liquidFlow.getTotalLength();
    gsap.set(liquidFlow, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });

    gsap.set(spark, {
      x: midX,
      y: 0
    });

    return pathLength;
  }

  setupPath();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root.querySelector(".portfolio-skills-section"),
      start: "top 70%",
      end: "bottom 20%",
      scrub: 1
    }
  });

  tl.to(liquidFlow, {
    strokeDashoffset: 0,
    ease: "none"
  }, 0);

  tl.to(spark, {
    motionPath: {
      path: liquidFlow,
      align: liquidFlow,
      alignOrigin: [0.5, 0.5]
    },
    ease: "none"
  }, 0);

  cards.forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 55%",
      onEnter: () => card.classList.add("active"),
      onLeaveBack: () => card.classList.remove("active")
    });
  });

  window.addEventListener("resize", () => {
    setupPath();
    ScrollTrigger.refresh();
  });

  ScrollTrigger.refresh();
}

async function loadMindmap() {
  const mount = document.getElementById("mindmap-root");
  if (!mount) return;

  const res = await fetch("mindmap.html");
  const html = await res.text();
  mount.innerHTML = html;

  initMindmap(mount);
}

document.addEventListener("DOMContentLoaded", () => {
  setupHeroVideoScroll();
  loadMindmap();
});