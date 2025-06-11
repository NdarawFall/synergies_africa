import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // À IMPORTER pour *ngIf, *ngFor
import { AgroEchoCardComponent } from '../../components/agro-echo-card/agro-echo-card.component';
import { HeaderPageComponent } from '../../components/header-page/header-page.component';
import { PublicationService } from '../../services/publication.service'; // Importer le service
import { Publication } from '../../models/publication.model'; // Importer le modèle

@Component({
  selector: 'app-agro-echo-pages',
  standalone: true, // N'oubliez pas standalone: true si c'est le cas
  imports: [CommonModule, AgroEchoCardComponent, HeaderPageComponent], // Ajouter CommonModule
  templateUrl: './agro-echo-pages.component.html',
  styleUrl: './agro-echo-pages.component.scss',
})
export class AgroEchoPagesComponent implements OnInit {
  agroEchos: Publication[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private publicationService: PublicationService) {}

  ngOnInit(): void {
    this.loadAgroEchos();
  }

  async loadAgroEchos(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      // Ici, on demande le type 'agro' au lieu de 'publi'
      const publications = await this.publicationService.getPublications(
        'agro'
      );
      if (publications) {
        this.agroEchos = publications;
      } else {
        this.agroEchos = [];
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des Agro-Echos:', error);
      this.errorMessage = `Impossible de charger les actualités: ${
        error.message || 'Erreur inconnue'
      }`;
    } finally {
      this.isLoading = false;
    }
  }
}
