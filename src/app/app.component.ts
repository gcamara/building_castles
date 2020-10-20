import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // Inform if the building process has started
  started = false;

  // Inform if the building process is finished
  finished = false;

  // Control the displaying message of the single button on screen
  firstCastles = true;

  // The user input
  land: FormControl;

  // Amount of castles built
  castles: any[];

  // Numbers of Peaks
  peaks: number;

  // Numbers of Valleys
  valleys: number;

  constructor() {
    this.land = new FormControl('');
  }

  /**
   * Check whether the user input is valid or not.
   */
  checkInput(): void {
    this.land.setErrors(null);
    let errors = false;

    if (!this.land.value.trim().length) {
      this.land.setErrors({ empty: true });
      return;
    }

    for (const element of this.landStretch) {
      errors = isNaN(parseFloat(element));
      if (errors) {
        this.land.setErrors({ 'wrong-input': true });
        break;
      }
    }
  }

  /**
   * Starts the process of building castles!
   */
  build(): void {
    this.checkInput();

    if (!this.land.invalid) {

      // Let's make some castles
      this.started = true;
      this.finished = false;

      let peaks = 0;
      let valleys = 0;

      // REQ 01 - You can always build a castle at the start of the array, provided it is non-empty.
      this.castles = [[]];

      // Get it once, so we prevent a lot of splits of this getter
      const stretch = this.landStretch;

      /* Here we'll store the numbers checked.
       * If we have the given sequence [6,2,2,2,3,1] the sequence of three 2 will be stored as a single [2].
       * So, in the example above, we would check whether [6,2,3] is a peak or a valley.
       */
      let combinationToBeChecked = [];

      for (let i = 0; i < stretch.length; i++) {
        const previousHeight = stretch[i - 1];
        const currentHeight = stretch[i];
        const nextHeight = stretch[i + 1];

        // If we don't have nothing before, let's keep moving
        if (!previousHeight) {
          continue;
        }

        // We found our first duplication (e.g: [3, 2 <- , 2])
        if (currentHeight === nextHeight && currentHeight !== previousHeight) {
          combinationToBeChecked.push(previousHeight);
          combinationToBeChecked.push(currentHeight);
          continue;
        }

        // If there's any combinations, we shall check
        if (combinationToBeChecked.length) {
          /* But if the current number is equal to the last one (e.g.: [2,2,2]), we have a repetition, so let's move on until we find
           * something different */
          if (currentHeight === combinationToBeChecked[combinationToBeChecked.length - 1]) {
            continue;
          }

          // Now we have found something different, let's check it
          combinationToBeChecked.push(currentHeight);
          if (this.isPeak(combinationToBeChecked)) {
            peaks += 1;
            this.castles.push(combinationToBeChecked);
          } else if (this.isValley(combinationToBeChecked)) {
            valleys += 1;
            this.castles.push(combinationToBeChecked);
          }


          // Back one position so the last repeating number becomes the first to check on the next
          // iteration
          i -= 1;
          combinationToBeChecked = [];

          continue;
        }

        /*
          * It looks like they're different (e.g: [3,2,4]).
          * Let's check
        */
        if (currentHeight !== previousHeight && currentHeight !== nextHeight) {
          combinationToBeChecked = [previousHeight, currentHeight, nextHeight];
          if (this.isPeak(combinationToBeChecked)) {
            peaks += 1;
            this.castles.push(combinationToBeChecked);
          } else if (this.isValley(combinationToBeChecked)) {
            valleys += 1;
            this.castles.push(combinationToBeChecked);
          }
          combinationToBeChecked = [];
        }
      }

      this.started = false;
      if (this.firstCastles) {
        this.firstCastles = false;
      }

      this.finished = true;

      // REQ02 - You can always build a castle at the end of the array, provided it is non-empty
      this.castles.push([]);

      this.peaks = peaks;
      this.valleys = valleys;
    }
  }

  /**
   * Check the user input to allow only numbers, comma or enter (for submiting purposes).
   * @param event The keyboard event.
   */
  numbersAndCommaOnly(event: KeyboardEvent): boolean {
    return !isNaN(parseFloat(event.key)) || event.key === ',' || event.key === 'Enter';
  }

  /**
   * Check if the combination is a Peak.
   * @param combination The combination to be checked.
   */
  isPeak(arr: string[]): boolean {
    if (arr.length < 3) {
      return false;
    }

    const prev = parseFloat(arr[0]);
    const curr = parseFloat(arr[1]);
    const next = parseFloat(arr[2]);

    if (!prev || !next) {
      return false;
    }

    return prev < curr && curr > next;
  }

  /**
   * Check if the combination is a Valley.
   * @param combination The combination to be checked.
   */
  isValley(arr: string[]): boolean {
    if (arr.length < 3) {
      return false;
    }

    const prev = parseFloat(arr[0]);
    const curr = parseFloat(arr[1]);
    const next = parseFloat(arr[2]);
    if (!prev || !next) {
      return false;
    }

    return prev > curr && curr < next;
  }

  /**
   * The first and the last elements are always added because of REQ01 and REQ02.
   * So, in order to keep the terrain easy to see, if the current castle is the first
   * or the last, than we shall look their predecessors or successors and apply the opposite
   * css class.
   *
   * Otherwise, it'll check if it's a peak or a valley and apply the correct class.
   * @param index the current index of the castle
   */
  terrainClass(index: number): string {
    if (index > 0 && index < this.castles.length - 1) {
      return this.isPeak(this.castles[index]) ? 'peak' : 'valley';
    }

    const indexOfCastleToCheck = index === 0 ? 1 : this.castles.length - 2;

    return this.isPeak(this.castles[indexOfCastleToCheck]) ? 'valley' : 'peak';
  }

  /**
   * Resets all values to default.
   */
  reset(): void {
    this.firstCastles = true;
    this.started = false;
    this.finished = false;
    this.castles = [];
    this.peaks = 0;
    this.valleys = 0;
    this.land.setValue('');
  }

  /**
   * Splits the user input.
   */
  get landStretch(): string[] {
    const value = this.land.value.trim();
    const landStretch = value.split(',');

    return landStretch;
  }
}
