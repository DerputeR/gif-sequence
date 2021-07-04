var doc = window.document;
var context = doc.querySelector(".js-loopContainer");
var items = doc.querySelectorAll(".js-loopItem");
var clones = [];
var disableScroll = false;
var scrollHeight = 0;
var scrollPos = 0;
var clonesHeight = 0;

function getScrollPos() {
  return (context.pageYOffset || context.scrollTop) - (context.clientTop || 0);
}

function setScrollPos(pos) {
  context.scrollTop = pos;
}

function getClonesHeight() {
  clonesHeight = 0;

  Array.from(clones, clone => {
    clonesHeight = clonesHeight + clone.offsetHeight;
  });

  return clonesHeight;
}

function reCalc() {
  scrollPos = getScrollPos();
  scrollHeight = context.scrollHeight;
  clonesHeight = getClonesHeight();

  if (scrollPos <= 0) {
    setScrollPos(1); // Scroll down 1 pixel to allow upward scrolling
  }
}

function scrollUpdate() {
  if (!disableScroll) {
    scrollPos = getScrollPos();

    if (clonesHeight + scrollPos >= scrollHeight) {
      // Scroll to the top when you've reached the bottom
      setScrollPos(1); // Scroll down 1 pixel to allow upwards scrolling
      disableScroll = true;
    } else if (scrollPos <= 0) {
      // Scroll to the bottom when you've reached the top
      setScrollPos(scrollHeight - clonesHeight);
      disableScroll = true;
    }
  }

  if (disableScroll) {
    // Disable scroll-jumping for a time to avoid flickering
    window.setTimeout(function () {
      disableScroll = false;
    }, 40);
  }
}

function onLoad() {
  Array.from(items, item => {
    const clone = item.cloneNode(true);
    context.appendChild(clone);
    clone.classList.add("js-clone");
  });

  clones = context.querySelectorAll(".js-clone");

  reCalc();

  context.addEventListener("scroll", function () {
    window.requestAnimationFrame(scrollUpdate);
  }, false);

  window.addEventListener("resize", function () {
    window.requestAnimationFrame(reCalc);
  }, false);

  window.onLoad = onLoad;
  setTimeout(reCalc, 50);
}

onLoad();