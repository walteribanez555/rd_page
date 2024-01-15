import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Beneficiario, Siniestro } from 'src/app/Modules/Core/models';

@Component({
  selector: 'siniestro-details',
  templateUrl : './siniestro-details.component.html',
  styleUrls: ['./siniestro-details.component.css'],
})
export class SiniestroDetailsComponent {

  @Input() siniestro! : Siniestro;
  @Input() beneficiario! : Beneficiario;


 }
