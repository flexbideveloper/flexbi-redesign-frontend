import { Injectable } from '@angular/core';

import { fromEvent, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TabSyncService {
  storageChange$ = (key: string): Observable<{ oldValue: any; newValue: any }> =>
    fromEvent<StorageEvent>(window, 'storage').pipe(
      filter(event => {
        return event.storageArea === localStorage;
      }),
      filter(event => {
        return event.key === key;
      }),
      map(event => ({
        oldValue: event.oldValue,
        newValue: event.newValue
      }))
    );
}
