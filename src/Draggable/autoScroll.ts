const EDGE_THRESHOLD = 80;
const MAX_SCROLL_SPEED = 25;

let rafId = 0;

let latestX = 0;
let latestY = 0;

let latestContainer: HTMLElement | null = null;

function isScrollable(el: HTMLElement): boolean {
  const style = getComputedStyle(el);

  const overflowY = style.overflowY;
  const overflowX = style.overflowX;

  const canScrollY =
    (overflowY === "auto" || overflowY === "scroll") &&
    el.scrollHeight > el.clientHeight;

  const canScrollX =
    (overflowX === "auto" || overflowX === "scroll") &&
    el.scrollWidth > el.clientWidth;

  return canScrollY || canScrollX;
}

export function getScrollParents(node: HTMLElement): HTMLElement[] {
  const parents: HTMLElement[] = [];

  let parent = node.parentElement;

  while (parent) {
    if (isScrollable(parent)) {
      parents.push(parent);
    }

    parent = parent.parentElement;
  }

  parents.push(document.documentElement);

  return parents;
}

function getDelta(pointer: number, start: number, end: number): number {
  // near start edge
  if (pointer < start + EDGE_THRESHOLD) {
    const distance = pointer - start;

    const intensity = (EDGE_THRESHOLD - distance) / EDGE_THRESHOLD;

    return -Math.min(MAX_SCROLL_SPEED, intensity * MAX_SCROLL_SPEED);
  }

  // near end edge
  if (pointer > end - EDGE_THRESHOLD) {
    const distance = end - pointer;

    const intensity = (EDGE_THRESHOLD - distance) / EDGE_THRESHOLD;

    return Math.min(MAX_SCROLL_SPEED, intensity * MAX_SCROLL_SPEED);
  }

  return 0;
}

function getRect(el: HTMLElement) {
  const isRoot = el === document.documentElement || el === document.body;

  if (isRoot) {
    return {
      top: 0,
      left: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    };
  }

  return el.getBoundingClientRect();
}

function canScrollY(el: HTMLElement, amount: number): boolean {
  if (amount < 0) {
    return el.scrollTop > 0;
  }

  return el.scrollTop + el.clientHeight < el.scrollHeight;
}

function canScrollX(el: HTMLElement, amount: number): boolean {
  if (amount < 0) {
    return el.scrollLeft > 0;
  }

  return el.scrollLeft + el.clientWidth < el.scrollWidth;
}

function scrollElement(el: HTMLElement): boolean {
  const rect = getRect(el);

  const dx = getDelta(latestX, rect.left, rect.right);

  const dy = getDelta(latestY, rect.top, rect.bottom);

  let didScroll = false;

  if (dx !== 0 && canScrollX(el, dx)) {
    el.scrollLeft += dx;
    didScroll = true;
  }

  if (dy !== 0 && canScrollY(el, dy)) {
    el.scrollTop += dy;
    didScroll = true;
  }

  return didScroll;
}

function loop() {
  if (latestContainer) {
    const parents = getScrollParents(latestContainer);

    // nearest parent first
    for (const parent of parents) {
      const didScroll = scrollElement(parent);

      // stop after first active scroll
      if (didScroll) {
        break;
      }
    }
  }

  rafId = requestAnimationFrame(loop);
}

export function startAutoScroll() {
  stopAutoScroll();

  rafId = requestAnimationFrame(loop);
}

export function autoScroll(
  pointerX: number,
  pointerY: number,
  container?: HTMLElement | null,
) {
  latestX = pointerX;
  latestY = pointerY;

  if (container !== undefined) {
    latestContainer = container;
  }
}

export function stopAutoScroll() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}
