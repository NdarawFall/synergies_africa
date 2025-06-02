import { Component, Input } from '@angular/core'; // Importer Input
import { Publication } from '../../models/publication.model'; // Importer le modèle
import { CommonModule } from '@angular/common'; // Pour les directives comme *ngIf, *ngFor, date pipe etc.
import { RouterLink } from '@angular/router'; // Importer RouterLink pour [routerLink]
import { CloudinaryModule } from '@cloudinary/ng'; // Pour le composant cl-image

@Component({
  selector: 'app-reportage-card',
  standalone: true, // Assurez-vous qu'il est standalone
  imports: [CommonModule, CloudinaryModule, RouterLink], // Ajouter RouterLink
  templateUrl: './reportage-card.component.html',
  styleUrl: './reportage-card.component.scss'
})
export class ReportageCardComponent {
  @Input() reportageData!: Publication; // Définir l'Input. L'opérateur ! est utilisé car il sera fourni par le parent.
                                      // Vous pourriez aussi le rendre optionnel avec ? et gérer le cas où il est undefined.

  // Vous pouvez ajouter un getter pour la première image pour simplifier le template
  get firstImageUrl(): string | undefined {
    return this.reportageData?.photoUrls?.[0];
  }

  // Vous pouvez ajouter une méthode pour formater la date si nécessaire, ou utiliser le pipe `date` dans le template
}
