import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  delay (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
