import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

describe('Unit tests - AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [ FormsModule, ReactiveFormsModule ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should checkInput()', () => {
    component.land.setValue('123,');
    component.checkInput();
    expect(component.land.hasError('wrong-input')).toBe(true, 'on wrong user input');

    component.land.setValue('1,1,2');
    component.checkInput();
    expect(component.land.hasError('wrong-input')).toBe(false, 'on correct user input');
  });

  it('should build() with wrong user input', () => {
    component.land.setValue('123,');
    component.build();
    expect(component.finished).toBeFalse();
  });

  it('should build() with right user input', () => {
    component.land.setValue('1,2,1');
    component.build();
    expect(component.finished).toBeTrue();
  });

  it('should check numbersAndCommaOnly()', () => {
    let event = new KeyboardEvent('keypress', { key: 'a' });
    expect(component.numbersAndCommaOnly(event)).toBe(false, 'on wrong user input');

    event = new KeyboardEvent('keypress', { key: '1' });
    expect(component.numbersAndCommaOnly(event)).toBe(true, 'on user input a number');

    event = new KeyboardEvent('keypress', { key: ',' });
    expect(component.numbersAndCommaOnly(event)).toBe(true, 'on user input a comma');

    event = new KeyboardEvent('keypress', { key: '-' });
    expect(component.numbersAndCommaOnly(event)).toBe(false, 'on user press another symbol');
  });

  it('should check if combination isPeak()', () => {
    let combination = ['1', '2', '3'];
    expect(component.isPeak(combination)).toBe(false, 'on [1, 2, 3]');

    combination = ['2', '2', '2'];
    expect(component.isPeak(combination)).toBe(false, 'on [2, 2, 2]');

    combination = ['1', '2', '1'];
    expect(component.isPeak(combination)).toBe(true, 'on [1, 2, 1]');

    combination = ['1', '3', '1'];
    expect(component.isPeak(combination)).toBe(true, 'on [1, 3, 3, 3, 3, 1]');

    combination = ['1', '2', '3', '4'];
    expect(component.isPeak(combination)).toBe(false, 'on more than 3 elements');
  });

  it('should check if combination isValley()', () => {
    let combination = ['1', '2', '3'];
    expect(component.isValley(combination)).toBe(false, 'on [1, 2, 3]');

    combination = ['2', '2', '2'];
    expect(component.isValley(combination)).toBe(false, 'on [2, 2, 2]');

    combination = ['2', '1', '2'];
    expect(component.isValley(combination)).toBe(true, 'on [2, 1, 2]');

    combination = ['2', '1', '2'];
    expect(component.isValley(combination)).toBe(true, 'on [2, 1, 1, 1, 1, 2]');

    combination = ['1', '2', '3', '4'];
    expect(component.isValley(combination)).toBe(false, 'on more than 3 elements');
  });

  it('should check the terrainClass()', () => {
    component.castles = [[], ['2', '1', '2'], []];
    expect(component.terrainClass(0)).toBe('peak');
    expect(component.terrainClass(1)).toBe('valley');
    expect(component.terrainClass(2)).toBe('peak');

    component.castles = [[], ['1', '2', '1'], []];
    expect(component.terrainClass(0)).toBe('valley');
    expect(component.terrainClass(1)).toBe('peak');
    expect(component.terrainClass(2)).toBe('valley');
  });

  it('should reset()', () => {
    component.land.setValue('1,5,2');
    component.build();

    expect(component.firstCastles).toBe(false);

    component.reset();
    expect(component.firstCastles).toBe(true, 'on firstCastles');
    expect(component.started).toBe(false, 'on started');
    expect(component.finished).toBe(false, 'on finished');
    expect(component.castles).toEqual([], 'on castles');
    expect(component.peaks).toBe(0, 'on peaks');
    expect(component.valleys).toBe(0, 'on valleys');
    expect(component.land.value).toEqual('', 'on user input');
  });

  it('should get the landStretch()', () => {
    component.land.setValue('1,5,2');
    expect(component.landStretch.length).toBe(3);
  });

});
