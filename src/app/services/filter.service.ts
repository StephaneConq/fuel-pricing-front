import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filters = {
    fuels: [],
    services: []
  };

  possibleFuels = [];
  possibleServices = [];

  constructor() { }
}
