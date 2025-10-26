import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Core Services
import { ApiService } from './services/api.service';
import { ConfigService } from './services/config.service';
import { NotificationService } from './services/notification.service';
import { StorageService } from './services/storage.service';
import { ValidationService } from './services/validation.service';
import { UtilityService } from './services/utility.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    providers: [
        ApiService,
        ConfigService,
        NotificationService,
        StorageService,
        ValidationService,
        UtilityService,
    ],
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
