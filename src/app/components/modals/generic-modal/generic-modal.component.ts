import {
    Component, HostListener, Input,
    OnInit
} from '@angular/core';

@Component({
    selector: 'app-generic-modal',
    templateUrl: './generic-modal.component.html',
    styleUrls: ['./generic-modal.component.scss']
})
export class GenericModalComponent implements OnInit {
    @Input() isVisible: boolean;
    @Input() minWidth: string;
    @Input() maxWidth: string;
    @Input() zIndex: string;
    @Input() width: string;

    biggerThanSmScreen = false;

    ngOnInit(): void {
        this.getWindowSize();
    }

    toggle(boolean) {
        this.isVisible = boolean;
    }

    @HostListener('window:resize', ['$event'])
    getWindowSize() {
        if (window.innerWidth > 640) {
            this.biggerThanSmScreen = true;
            return;
        }
        this.biggerThanSmScreen = false;
    }
}
