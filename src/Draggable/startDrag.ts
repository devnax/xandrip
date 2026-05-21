"use client";
import { HTMLProps, ReactElement, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  applyElementProps,
  getDraggable,
  getDraggables,
  getDroppable,
} from "./elements";
import { autoScroll, startAutoScroll, stopAutoScroll } from "./autoScroll";
import { droppableRegistry } from "../Droppable";

export type XandripState = {
  draggable: {
    id: string;
    data: any;
    element: HTMLElement;
  };
  source: {
    id: string;
    index: number;
    data: any;
    element: HTMLElement;
  };
  target: null | {
    id: string;
    index: number;
    data: any;
    element: HTMLElement;
  };
};

function resolveDroppableFromPoint(
  x: number,
  y: number,
  draggable: HTMLElement,
  placeholder: HTMLElement,
): HTMLElement | null {
  const el = document.elementFromPoint(x, y) as HTMLElement | null;
  if (!el) return null;

  let container = el.closest("[data-xan-droppable]") as HTMLElement | null;

  // Ignore invalid/self containers
  if (
    !container ||
    draggable.contains(container) ||
    placeholder.contains(container)
  ) {
    return null;
  }

  return container;
}

export type StartDragProps = {
  onReady?: (state: XandripState, event: PointerEvent) => void;
  onStart?: (state: XandripState, event: PointerEvent) => void;
  onMove?: (state: XandripState, event: PointerEvent) => void;
  onDrop?: (state: XandripState, event: PointerEvent) => void;
  canCopy?: (state: XandripState, event: PointerEvent) => boolean;
  canDrag?: (state: XandripState, event: PointerEvent) => boolean;
  canDrop?: (state: XandripState, event: PointerEvent) => boolean;

  renderPlaceholder?: (
    state: XandripState,
    event: PointerEvent,
  ) => ReactElement<HTMLProps<HTMLElement>> | void;
  renderActiveItem?: (
    state: XandripState,
    event: PointerEvent,
  ) => ReactElement<HTMLProps<HTMLElement>> | void;
  getActiveItemProps?: (
    state: XandripState,
    event: PointerEvent,
  ) => HTMLProps<HTMLDivElement> | void;
  getPlaceholderProps?: (
    state: XandripState,
    event: PointerEvent,
  ) => HTMLProps<HTMLDivElement> | void;
  // getActiveDroppableProps?: (
  //   state: XandripState,
  //   event: PointerEvent,
  // ) => HTMLProps<HTMLDivElement> | void;

  // disableAnimation?: (state: XandripState, event: PointerEvent) => boolean
};

const startDrag = (
  event: PointerEvent,
  draggableId: string,
  data?: any,
  props?: StartDragProps,
) => {
  event.stopPropagation();

  const draggable = getDraggable(draggableId);
  const droppableId = draggable.dataset.xanDroppableId as string;
  const droppable = getDroppable(droppableId);
  const draggables = getDraggables(droppableId);
  const currentIndex = draggables.findIndex((d) => d === draggable);

  const state: XandripState = {
    draggable: {
      id: draggableId,
      data,
      element: draggable,
    },
    source: {
      id: droppableId,
      index: currentIndex,
      data: droppableRegistry.get(droppableId)?.data,
      element: droppable,
    },
    target: {
      id: droppableId,
      index: currentIndex,
      data: droppableRegistry.get(droppableId)?.data,
      element: droppable,
    },
  };

  const isSourceCopy = props?.canCopy ? props?.canCopy(state, event) : false;
  if (isSourceCopy) {
    state.target = null;
  }
  if (props?.canDrag && !props?.canDrag(state, event)) {
    return;
  }
  const rect = draggable.getBoundingClientRect();
  const grabX = (event.clientX - rect.left) / rect.width;
  const grabY = (event.clientY - rect.top) / rect.height;

  let drag_started = false;
  let drag_start_time = 0;
  let offsetX = event.clientX - rect.left;
  let offsetY = event.clientY - rect.top;

  draggable.querySelectorAll("*").forEach((el) => {
    const element = el as HTMLElement;
    element.draggable = false;
    element.style.userSelect = "none";
    element.style.touchAction = "none";
    (element.style as any).webkitUserDrag = "none";
  });

  draggable.draggable = false;
  draggable.style.userSelect = "none";
  draggable.style.touchAction = "none";
  (draggable.style as any).webkitUserDrag = "none";

  const clone = draggable.cloneNode(true) as HTMLElement;
  const placeholder = draggable.cloneNode(true) as HTMLElement;
  const cloneRoot = createRoot(clone);
  const placeholderRoot = createRoot(placeholder);

  placeholder.removeAttribute("data-xan-droppable-id");
  placeholder.removeAttribute("data-xan-draggable");
  placeholder.removeAttribute("style");

  placeholder.style.display = `none`;
  placeholder.style.opacity = `.3`;
  placeholder.draggable = false;
  placeholder.style.userSelect = "none";
  (placeholder.style as any).webkitUserDrag = "none";

  clone.removeAttribute("data-xan-droppable-id");
  clone.removeAttribute("data-xan-draggable");
  clone.removeAttribute("style");

  clone.draggable = false;
  clone.style.userSelect = "none";
  (clone.style as any).webkitUserDrag = "none";
  clone.style.position = "fixed";
  clone.style.top = `${rect.top}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.margin = "0";
  clone.style.pointerEvents = "none";
  clone.style.willChange = "transform";
  clone.style.zIndex = "999999";
  clone.style.visibility = "hidden";

  let prevKey = "";
  const renderDragElements = (_state: any, e: PointerEvent) => {
    const key =
      `${_state.source.id}:${_state.source.index}|` +
      `${_state.target?.id ?? ""}:${_state.target?.index ?? -1}`;
    if (key === prevKey) return;
    prevKey = key;

    if (props?.renderPlaceholder) {
      const pdom = props.renderPlaceholder(_state, e);
      if (pdom) {
        placeholder.style.removeProperty("opacity");
        placeholderRoot.render(pdom);
      }
    }

    if (props?.renderActiveItem) {
      const activedom = props.renderActiveItem(_state, e) as ReactNode;
      if (activedom) {
        cloneRoot.render(activedom);
      }
    }

    if (props?.getPlaceholderProps) {
      const pprops = props.getPlaceholderProps(_state, e);
      if (pprops) {
        applyElementProps(placeholder, pprops);
      }
    }

    if (props?.getActiveItemProps) {
      const aprops = props.getActiveItemProps(_state, e);
      if (aprops) {
        applyElementProps(clone, aprops);
      }
    }
  };

  renderDragElements(state, event);
  startAutoScroll();

  draggable.after(placeholder);
  droppable.after(clone);

  if (props?.renderActiveItem && props?.renderActiveItem(state, event)) {
    const cloneRect = clone.getBoundingClientRect();
    offsetX = cloneRect.width * grabX;
    offsetY = cloneRect.height * grabY;

    clone.style.width = `auto`;
    clone.style.height = `auto`;
    clone.style.display = `inline-block`;
  }

  if (props?.onReady) {
    props.onReady(state, event);
  }

  const Move = (e: PointerEvent) => {
    if (!drag_started) {
      drag_start_time = Date.now();
      const cloneRect = clone.getBoundingClientRect();
      offsetX = cloneRect.width * grabX;
      offsetY = cloneRect.height * grabY;
      clone.style.visibility = "visible";

      if (props?.onStart) {
        props.onStart(state, e);
      }
    }

    drag_started = true;

    const x = e.clientX - offsetX - rect.left;
    const y = e.clientY - offsetY - rect.top;

    clone.style.transform = `translate(${x}px, ${y}px)`;

    // hide original
    if (!isSourceCopy) {
      draggable.style.display = "none";
      placeholder.style.display = `block`;
    } else {
      if (state.target && state.source.id !== state.target?.id) {
        placeholder.style.display = `block`;
      }
    }

    let container = resolveDroppableFromPoint(
      e.clientX,
      e.clientY,
      draggable,
      placeholder,
    );

    autoScroll(e.clientX, e.clientY, container);

    if (!container) {
      state.target = null;
      placeholder.style.display = "none";
      renderDragElements(state, e);
      if (props?.onMove) {
        props.onMove(state, e);
      }
      return;
    }

    if (props?.canCopy) {
      const isTargetCopy = props?.canCopy(
        {
          ...state,
          target: null,
          source: {
            id: container.dataset.xanDroppable as string,
            index: 0,
            data: droppableRegistry.get(container.dataset.xanDroppable)?.data,
            element: container,
          },
        },
        e,
      );

      if (isTargetCopy) {
        placeholder.style.display = "none";
        return;
      }
    }

    if (props?.canDrop) {
      const is = props?.canDrop(
        {
          ...state,
          target: {
            id: container.dataset.xanDroppable as string,
            index: 0,
            data: droppableRegistry.get(container.dataset.xanDroppable)?.data,
            element: container,
          },
        },
        e,
      );

      if (!is) {
        state.target = null;
        placeholder.style.display = "none";
        return;
      }
    }

    const targetConId = container.dataset.xanDroppable as string;
    const targetDraggables = getDraggables(targetConId);
    const items = targetDraggables.filter(
      (el) => el !== draggable && el !== placeholder,
    );

    const rects = items.map((el) => el.getBoundingClientRect());
    const isList = rects.every((r) => Math.abs(r.left - rects[0].left) < 5);

    let insertIndex = items.length;
    const THRESHOLD = 6;

    for (let i = 0; i < items.length; i++) {
      const r = items[i].getBoundingClientRect();
      if (isList) {
        const midY = r.top + r.height / 2;
        if (e.clientY < midY - THRESHOLD) {
          insertIndex = i;
          break;
        }
      } else {
        if (e.clientY < r.top) {
          insertIndex = i;
          break;
        }
        const midX = r.left + r.width / 2;
        const isSameRow = e.clientY >= r.top && e.clientY <= r.bottom;

        if (isSameRow && e.clientX < midX - THRESHOLD) {
          insertIndex = i;
          break;
        }
      }
    }

    const refNode = items[insertIndex];
    if (
      placeholder.nextElementSibling !== refNode ||
      placeholder.parentElement !== container
    ) {
      if (refNode) {
        container.insertBefore(placeholder, refNode);
      } else {
        container.appendChild(placeholder);
      }
    }

    state.target = {
      id: targetConId,
      index: insertIndex,
      data: droppableRegistry.get(targetConId)?.data,
      element: container,
    };

    renderDragElements(state, e);
    if (props?.onMove) {
      props.onMove(state, e);
    }
  };

  const Up = (e: PointerEvent) => {
    stopAutoScroll();
    document.removeEventListener("pointermove", Move);
    document.removeEventListener("pointerup", Up);
    document.removeEventListener("pointercancel", Up);

    let targetX = 0;
    let targetY = 0;

    if (state.target) {
      const finalRect = placeholder.getBoundingClientRect();
      targetX = finalRect.left - rect.left;
      targetY = finalRect.top - rect.top;
    } else {
      targetX = 0;
      targetY = 0;
    }

    clone.style.transition = "transform 180ms cubic-bezier(.2,.8,.2,1)";
    clone.style.transform = `translate(${targetX}px, ${targetY}px)`;

    const finish = () => {
      clone.removeEventListener("transitionend", finish);
    };

    const elapsed = Date.now() - drag_start_time;
    if (elapsed < 180) {
      cleanup(e);
    } else {
      setTimeout(() => {
        cleanup(e);
      }, 180);
    }

    clone.addEventListener("transitionend", finish);
  };

  const cleanup = (e: PointerEvent) => {
    const isStarted = drag_started;
    drag_started = false;
    if (props?.onDrop && state.target && isStarted) {
      props.onDrop(state, e);
    }

    draggable.style.removeProperty("display");
    cloneRoot.unmount();
    placeholderRoot.unmount();

    clone.remove();
    placeholder.remove();
    // root.style.removeProperty("user-select");
    (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
  };

  (event.target as HTMLElement).setPointerCapture(event.pointerId);
  document.addEventListener("pointermove", Move);
  document.addEventListener("pointerup", Up);
  document.addEventListener("pointercancel", Up);
};

export default startDrag;
