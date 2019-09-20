import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CronComponent } from './cron-config/cron.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from '../app-routing.module';
import { PageActionModule } from '../page-action/page-action.module';


@NgModule({
    imports: [
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        PageActionModule
    ],
    declarations: [
        CronComponent
    ],
    exports: [
        CronComponent
    ]
})
export class CronModule {

}
