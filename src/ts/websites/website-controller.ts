import { FocusMode } from './../focus/types'
import DistractionWatcher, { DistractionTarget } from './distraction-watcher'

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
}