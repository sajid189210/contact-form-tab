import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ITab {
  label: string;
  id: string | number;
  active: boolean;
}

@Component({
  selector: 'app-header-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-tabs.component.html',
  styleUrl: './header-tabs.component.scss'
})
export class HeaderTabsComponent {
  @Input() tabs: ITab[] = [];
  @Output() tabSelected = new EventEmitter<{ index: number, tab: ITab }>();
  @Output() addNew = new EventEmitter<void>();
  @Output() deleteTab = new EventEmitter<ITab>();

  onTabClick(index: number, tab: ITab): void {
    this.tabSelected.emit({ index, tab });
  }

  ngOnInit() {
    console.log(this.tabs)
  }

  onAddNew(): void {
    this.addNew.emit();
  }

  onDeleteTab(event: Event, tab: ITab): void {
    event.stopPropagation(); // Prevent tab selection when deleting
    this.deleteTab.emit(tab);
  }
}
