/**
 * DistractionWatcher manages MutationObservers for tracking dynamic content changes
 * across different website controllers. It provides a clean interface for watching
 * and unwatching distractions with semantic callbacks.
 */

export interface DistractionTarget {
  target: Element | string;
  whenFound: () => void;
  options?: MutationObserverInit;
}

export default class DistractionWatcher {
  private observers: Map<string, MutationObserver> = new Map();

  watchFor(name: string, distractionTarget: DistractionTarget): void {
    this.stopWatching(name);

    const { target, whenFound, options = { childList: true, subtree: true } } = distractionTarget;
    
    // If the selector string doesn't match anything yet, falls back to
    // document.body — meaning the observer fires on every DOM mutation site-wide
    // until the intended target appears. Callers should accept this as a temporary
    // worst case or ensure the selector matches before calling watchFor.
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