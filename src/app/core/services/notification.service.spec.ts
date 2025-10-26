import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
    let service: NotificationService;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('MatSnackBar', ['open', 'dismiss']);

        TestBed.configureTestingModule({
            providers: [
                NotificationService,
                { provide: MatSnackBar, useValue: spy }
            ]
        });

        service = TestBed.inject(NotificationService);
        snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should show success notification', () => {
        const message = 'Success message';
        service.success(message);

        expect(snackBarSpy.open).toHaveBeenCalledWith(
            message,
            'Close',
            jasmine.objectContaining({
                panelClass: ['notification-success']
            })
        );
    });

    it('should show error notification with no auto-dismiss', () => {
        const message = 'Error message';
        service.error(message);

        expect(snackBarSpy.open).toHaveBeenCalledWith(
            message,
            'Close',
            jasmine.objectContaining({
                panelClass: ['notification-error'],
                duration: 0
            })
        );
    });

    it('should show warning notification', () => {
        const message = 'Warning message';
        service.warning(message);

        expect(snackBarSpy.open).toHaveBeenCalledWith(
            message,
            'Close',
            jasmine.objectContaining({
                panelClass: ['notification-warning']
            })
        );
    });

    it('should show info notification', () => {
        const message = 'Info message';
        service.info(message);

        expect(snackBarSpy.open).toHaveBeenCalledWith(
            message,
            'Close',
            jasmine.objectContaining({
                panelClass: ['notification-info']
            })
        );
    });

    it('should dismiss all notifications', () => {
        service.dismiss();
        expect(snackBarSpy.dismiss).toHaveBeenCalled();
    });
});
