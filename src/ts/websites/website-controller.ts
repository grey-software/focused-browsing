import { FocusMode } from './../focus/types'
import utils from './utils'

export interface DistractionTarget {
  target: Element | string;
  whenFound: () => void;
  options?: MutationObserverInit;
}

export default abstract class WebsiteController {
  // Track intervals for automatic cleanup
  protected intervals: Map<string, number> = new Map()
  
  // Simple distraction watching
  protected distractionWatcher: DistractionWatcher = new DistractionWatcher()
  
  renderFocusMode(focusMode: FocusMode) {
    switch (focusMode) {
      case FocusMode.Focused: {
        this.focus()
        return
      }
      case FocusMode.Unfocused: {
        this.unfocus()
        return
      }
      
    }
  }

  // Shared interval management
  protected createInterval(name: string, callback: () => void, delay: number = 250): void {
    this.clearInterval(name)
    const intervalId = window.setInterval(callback, delay)
    this.intervals.set(name, intervalId)
  }

  protected clearInterval(name: string): void {
    const intervalId = this.intervals.get(name)
    if (intervalId) {
      window.clearInterval(intervalId)
      this.intervals.delete(name)
    }
  }

  // Shared element visibility toggle
  protected toggleElementVisibility(
    element: Element | null,
    visible: boolean,
    storageProperty: string,
    onHide?: (element: Element) => void,
    onShow?: (element: Element, storedChild: Node) => void
  ): void {
    if (!element) return
    
    if (!visible) {
      const childToStore = element.children[0]
      if (childToStore) {
        (this as any)[storageProperty] = childToStore
        element.removeChild(childToStore)
        onHide?.(element)
      }
    } else {
      const storedChild = (this as any)[storageProperty]
      if (storedChild) {
        element.appendChild(storedChild)
        onShow?.(element, storedChild)
      }
    }
  }

  // Shared try-catch blocking pattern
  protected tryBlocking(
    checkPage: (url: string) => boolean,
    isHidden: () => boolean,
    hasLoaded: () => boolean,
    onBlock: () => void | Promise<void>
  ): void {
    try {
      const url = document.URL
      if (!checkPage(url)) return
      if (isHidden()) return
      if (hasLoaded()) {
        onBlock()
      }
    } catch (err) {
      // Silent fail - expected behavior
    }
  }

  // Common unfocus cleanup
  protected performCommonUnfocus(): void {
    this.clearAllIntervals()
    this.distractionWatcher.stopWatchingAll()
  }

  // Shared method to clear all intervals
  protected clearAllIntervals() {
    this.intervals.forEach((intervalId) => {
      window.clearInterval(intervalId)
    })
    this.intervals.clear()
  }

  // Distraction watching helper methods
  protected watchFor(name: string, distractionTarget: DistractionTarget): void {
    this.distractionWatcher.watchFor(name, distractionTarget)
  }

  protected stopWatching(name: string): void {
    this.distractionWatcher.stopWatching(name)
  }

  protected stopWatchingAll(): void {
    this.distractionWatcher.stopWatchingAll()
  }

  protected abstract focus(): void
  protected abstract unfocus(): void
  protected abstract clearIntervals(): void
}

class DistractionWatcher {
  private observers: Map<string, MutationObserver> = new Map();

  watchFor(name: string, distractionTarget: DistractionTarget): void {
    this.stopWatching(name);

    const { target, whenFound, options = { childList: true, subtree: true } } = distractionTarget;
    
    // Resolve target element
    const targetElement = typeof target === 'string' 
      ? document.querySelector(target) || document.body 
      : target;

    const observer = new MutationObserver(() => {
      whenFound();
    });

    observer.observe(targetElement, options);
    this.observers.set(name, observer);

    // Execute callback immediately for initial state
    whenFound();
  }

  stopWatching(name: string): void {
    const observer = this.observers.get(name);
    if (observer) {
      observer.disconnect();
      this.observers.delete(name);
    }
  }

  stopWatchingAll(): void {
    this.observers.forEach((_, name) => this.stopWatching(name));
  }

  isWatching(name: string): boolean {
    return this.observers.has(name);
  }

  watchingCount(): number {
    return this.observers.size;
  }
}