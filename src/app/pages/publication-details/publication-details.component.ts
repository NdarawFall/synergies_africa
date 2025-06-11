import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Importer Location pour le bouton "Retour"
import { ActivatedRoute } from '@angular/router'; // Pour lire les paramètres de l'URL
import { PublicationService } from '../../services/publication.service';
import { Publication } from '../../models/publication.model';

@Component({
  selector: 'app-publication-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publication-details.component.html',
  styleUrls: ['./publication-details.component.scss'], // Notez le 's' à la fin de styleUrls
})
export class PublicationDetailComponent implements OnInit {
  publication: Publication | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  mainImageUrl: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private publicationService: PublicationService,
    private location: Location // Service Angular pour interagir avec l'historique du navigateur
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPublication(id);
    } else {
      this.isLoading = false;
      this.errorMessage =
        "L'identifiant de la publication est manquant dans l'URL.";
    }
  }

  async loadPublication(id: string): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      const data = await this.publicationService.getPublicationById(id);
      if (data) {
        this.publication = data;
        // Initialiser l'image principale avec la première photo de la liste
        this.mainImageUrl = data.photoUrls?.[0];
      } else {
        this.errorMessage =
          "Désolé, la publication demandée n'a pas été trouvée.";
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement de la publication:', error);
      this.errorMessage =
        'Une erreur est survenue lors du chargement du contenu.';
    } finally {
      this.isLoading = false;
    }
  }

  // Permet de changer l'image principale en cliquant sur une vignette
  changeMainImage(url: string): void {
    this.mainImageUrl = url;
  }

  // Fonction pour le bouton "Retour"
  goBack(): void {
    this.location.back();
  }
}
