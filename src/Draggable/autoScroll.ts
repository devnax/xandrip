const EDGE_THRESHOLD = 80;
const MAX_SCROLL_SPEED = 25;

const scrollParentCache = new WeakMap<HTMLElement, HTMLElement[]>();

let rafId = 0;
let latestX = 0;
let latestY = 0;
let latestContainer: HTMLElement | null = null;

function isScrollable(el: HTMLElement) {
   const style = getComputedStyle(el);

   return (
      (/(auto|scroll)/.test(style.overflowY) &&
         el.scrollHeight > el.clientHeight) ||
      (/(auto|scroll)/.test(style.overflowX) &&
         el.scrollWidth > el.clientWidth)
   );
}

export function getScrollParents(node: HTMLElement) {
   const parents: HTMLElement[] = [];

   let parent: HTMLElement | null = node.parentElement;

   while (parent) {
      if (isScrollable(parent)) {
         parents.push(parent);
      }
      parent = parent.parentElement;
   }

   parents.push(document.scrollingElement as HTMLElement);

   return parents;
}

export function getCachedScrollParents(el: HTMLElement) {
   let cached = scrollParentCache.get(el);

   if (!cached) {
      cached = getScrollParents(el);
      scrollParentCache.set(el, cached);
   }

   return cached;
}

function getDelta(pos: number, min: number, max: number) {
   if (pos < min + EDGE_THRESHOLD) {
      const d = pos - min;
      return -((EDGE_THRESHOLD - d) / EDGE_THRESHOLD) * MAX_SCROLL_SPEED;
   }

   if (pos > max - EDGE_THRESHOLD) {
      const d = max - pos;
      return ((EDGE_THRESHOLD - d) / EDGE_THRESHOLD) * MAX_SCROLL_SPEED;
   }

   return 0;
}

function loop() {
   const scrollables = latestContainer
      ? getCachedScrollParents(latestContainer)
      : [document.scrollingElement as HTMLElement];

   for (const el of scrollables) {
      const rect =
         el === document.scrollingElement
            ? {
               top: 0,
               left: 0,
               right: window.innerWidth,
               bottom: window.innerHeight,
            }
            : el.getBoundingClientRect();

      const dx = getDelta(latestX, rect.left, rect.right);
      const dy = getDelta(latestY, rect.top, rect.bottom);

      if (dx) el.scrollLeft += dx;
      if (dy) el.scrollTop += dy;
   }

   rafId = requestAnimationFrame(loop);
}

export function startAutoScroll() {
   if (rafId) cancelAnimationFrame(rafId);
   rafId = requestAnimationFrame(loop);
}

export function autoScroll(
   pointerX: number,
   pointerY: number,
   container?: HTMLElement | null
) {
   latestX = pointerX;
   latestY = pointerY;
   latestContainer = container ?? null;
}

export function stopAutoScroll() {
   cancelAnimationFrame(rafId);
   rafId = 0;
}