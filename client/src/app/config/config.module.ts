
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ArrayFormModule } from '../array-form/array-form.module';
import { ConfigEditorComponent } from './config-editor/config-editor.component';
import { ConfigService } from './config.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JSONEditorModule } from '../json-editor/json-editor.module';
import { MatDialogModule } from '@angular/material/dialog';
import { TooltipDialogComponent } from '../tooltip-dialog/tooltip-dialog.component';
import { MatDividerModule } from '@angular/material/divider';
import { PageActionModule } from '../page-action/page-action.module';


@NgModule({
    imports: [
        HttpClientModule,
        ArrayFormModule,
        CommonModule,
        FormsModule,
        JSONEditorModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,
        MatSelectModule,
        MatToolbarModule,
        MatTooltipModule,
        PageActionModule
    ],
    declarations: [
        ConfigEditorComponent,
        TooltipDialogComponent
    ],
    exports: [
        ConfigEditorComponent
    ],
    entryComponents: [TooltipDialogComponent],
    providers: [ConfigService]
})
export class ConfigModule {

}
