import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common"; // Import CommonModule pour *ngIf, *ngFor
import { ReportageCardComponent } from "../../components/reportage-card/reportage-card.component";
import { HeaderPageComponent } from "../../components/header-page/header-page.component";
import { PublicationService } from "../../services/publication.service"; // Importer le service
import { Publication } from "../../models/publication.model"; // Importer le modèle

@Component({
    selector: "app-reportage-page",
    standalone: true, 
    imports: [CommonModule, ReportageCardComponent, HeaderPageComponent], // Ajouter CommonModule
    templateUrl: "./reportage-page.component.html",
    styleUrl: "./reportage-page.component.scss",
})
export class ReportagePageComponent implements OnInit {
    reportages: Publication[] = [];
    isLoading: boolean = true;
    errorMessage: string | null = null;

    constructor(private publicationService: PublicationService) {}

    ngOnInit(): void {
        this.loadReportages();
    }

    async loadReportages(): Promise<void> {
        this.isLoading = true;
        this.errorMessage = null;
        try {
            // Supposons que 'publi' est le type pour les reportages.
            // Adaptez si votre type est différent (par exemple, 'publi-reportage').
            const publications = await this.publicationService.getPublications('publi');
            if (publications) {
                this.reportages = publications;
            } else {
                this.reportages = []; // Ou gérer comme une erreur si null signifie une erreur critique
            }
        } catch (error: any) {
            console.error("Erreur lors du chargement des reportages:", error);
            this.errorMessage = `Impossible de charger les reportages: ${error.message || 'Erreur inconnue'}`;
        } finally {
            this.isLoading = false;
        }
    }
}
