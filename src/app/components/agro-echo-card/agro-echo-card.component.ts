import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Publication } from '../../models/publication.model'; // Importer le modèle
import { CloudinaryModule } from '@cloudinary/ng';

@Component({
  selector: 'app-agro-echo-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CloudinaryModule],
  templateUrl: './agro-echo-card.component.html',
  styleUrl: './agro-echo-card.component.scss',
})
export class AgroEchoCardComponent {
  // On définit un Input pour recevoir les données de la publication
  @Input() agroEchoData!: Publication;

  // Getter pour simplifier l'accès à la première image dans le template
  get firstImageUrl(): string | undefined {
    return this.agroEchoData?.photoUrls?.[0];
  }
}
