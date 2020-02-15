import { NgModule } from '@angular/core';

import { DeckComponent } from './deck.component';
import { SharedModule } from '../shared/shared.module';
import { DeckNamePopupComponent } from './deck-name-popup/deck-name-popup.component';
import { DeckNamePopupService } from './deck-name-popup/deck-name-popup.service';
import { DeckEditComponent } from './deck-edit/deck-edit.component';
import { DeckEditToolbarComponent } from './deck-edit-toolbar/deck-edit-toolbar.component';
import { FilterCardsPipe } from './deck-edit-toolbar/filter-cards.pipe';
import { DeckCardComponent } from './deck-card/deck-card.component';
import { DeckEditPanesComponent } from './deck-edit-panes/deck-edit-panes.component';
import { DeckEditInfoComponent } from './deck-edit-info/deck-edit-info.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    DeckCardComponent,
    DeckComponent,
    DeckNamePopupComponent,
    DeckEditComponent,
    DeckEditToolbarComponent,
    FilterCardsPipe,
    DeckEditPanesComponent,
    DeckEditInfoComponent,
  ],
  entryComponents: [
    DeckNamePopupComponent
  ],
  providers: [
    DeckNamePopupService
  ]
})
export class DeckModule { }
