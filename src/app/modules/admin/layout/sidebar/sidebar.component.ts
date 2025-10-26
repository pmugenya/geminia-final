import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
    @Input() isOpen = false;
    @Output() toggleSidebar = new EventEmitter<void>();

    onToggle() {
        this.toggleSidebar.emit();
    }
}
