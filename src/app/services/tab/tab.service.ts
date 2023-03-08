import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { TabSyncService } from '../tab-sync/tab-sync.service';

export const TAB = {
  TAB_INFO: 'TAB_INFO',
  ACTIVE_TAB_ID: 'ACTIVE_TAB_ID',
  OPENED_TABS: 'OPENED_TABS',
};


@Injectable({
  providedIn: 'root',
})
export class TabService {
  IDCurrentTab: string = '';

  constructor(private tabSyncService: TabSyncService) {
    window.addEventListener('beforeunload', () => this.closeCurrentTab());
    this.tabSyncService
      .storageChange$(TAB.ACTIVE_TAB_ID)
      .subscribe(({ newValue, oldValue }) => {
        if (!newValue && oldValue) {
          const currentId = this.getCurrentTabInfo().id;
          this.setActiveTabID(currentId);
        }
      });
  }

  isTabActive(): boolean {
    const currentId = this.getCurrentTabInfo().id;
    const activeTabId = this.getActiveTabID();
    if (!activeTabId || (document.hasFocus() && activeTabId !== currentId)) {
      this.setActiveTabID(currentId);
    }

    return currentId === activeTabId;
  }

  closeCurrentTab(): void {
    this.setActiveTabID(null);
    this.setTabInfo(this.IDCurrentTab, new Date().getTime());
    this.removeTab(this.IDCurrentTab);
  }

  setTabInfo(id: string, timeClose?: number): void {
    const data = JSON.stringify({
      id,
      timeClose,
    });
    sessionStorage.setItem(TAB.TAB_INFO, data);
  }

  getCurrentTabInfo(): { id: string; timeClose?: number } {
    if (this.IDCurrentTab) {
      return { id: this.IDCurrentTab };
    }

    const tabInfo = sessionStorage.getItem(TAB.TAB_INFO);

    if (tabInfo) {
      const info = JSON.parse(tabInfo);
      if (!info.id) {
        info.id = uuidv4();
      }

      this.IDCurrentTab = info.id;
      this.addTab(this.IDCurrentTab);
      return info;
    }

    this.IDCurrentTab = uuidv4();
    this.setTabInfo(this.IDCurrentTab);
    this.addTab(this.IDCurrentTab);
    return { id: this.IDCurrentTab };
  }

  getActiveTabID(): string {
    return localStorage.getItem(TAB.ACTIVE_TAB_ID) || '';
  }

  setActiveTabID(id: string | null): void {
    if (!id) {
      localStorage.removeItem(TAB.ACTIVE_TAB_ID);
    }
    localStorage.setItem(TAB.ACTIVE_TAB_ID, id || '');
  }

  get allTabs(): { id: string; interactionTime: number }[] {
    try {
      const tabs = localStorage.getItem(TAB.OPENED_TABS);
      if (!tabs) {
        return [];
      }

      return JSON.parse(tabs);
    } catch {
      return [];
    }
  }

  addTab(id: string): void {
    try {
      const tabs = this.allTabs;
      const exists = !!this.allTabs.find((tab) => tab.id === id);
      if (exists) {
        return;
      }
      const interactionTime = new Date().getTime();
      tabs.push({ id, interactionTime });
      localStorage.setItem(TAB.OPENED_TABS, JSON.stringify(tabs));
      // eslint-disable-next-line no-empty
    } catch (e) {
      console.error(e);
    }
  }

  removeTab(id: string): void {
    try {
      const tabs = this.allTabs.filter((tab) => tab.id !== id);
      localStorage.setItem(TAB.OPENED_TABS, JSON.stringify(tabs));
      // eslint-disable-next-line no-empty
    } catch (e) {
      console.error(e);
    }
  }

  updateTabTimeInteraction(id: string): void {
    const tabs = this.allTabs;
    const tab = tabs.find((tab) => tab.id === id);

    if (tab) {
      const newTabs = tabs.filter((tab) => tab.id !== id);
      tab.interactionTime = new Date().getTime();
      newTabs.push(tab);
      localStorage.setItem(TAB.OPENED_TABS, JSON.stringify(newTabs));
    }
  }

  synctCondition(): boolean {
    if (!this.allTabs.length) {
      return true;
    }
    return this.isTabActive();
  }
}
