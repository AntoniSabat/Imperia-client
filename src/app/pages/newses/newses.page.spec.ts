import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsesPage } from './newses.page';

describe('NewsesPage', () => {
  let component: NewsesPage;
  let fixture: ComponentFixture<NewsesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewsesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
