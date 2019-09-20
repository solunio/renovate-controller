import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CronComponent } from './cron/cron-config/cron.component';
import { ConfigEditorComponent } from './config/config-editor/config-editor.component';


const routes: Routes = [
    { path: '', component: CronComponent },
    { path: 'config', component: ConfigEditorComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
