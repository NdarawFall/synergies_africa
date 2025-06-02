import { Injectable } from "@angular/core";
import { Auth, onAuthStateChanged, User } from "@angular/fire/auth"; // Conservé pour l'authentification
import { Publication } from "../models/publication.model"; // Assurez-vous que le chemin est correct
import { SupabaseService } from "./supabase.service"; // Nouveau service
import { CloudinaryService } from "./cloudinary.service"; // Nouveau service
// Les imports spécifiques à Firestore et Firebase Storage sont supprimés

@Injectable({
    providedIn: "root",
})
export class PublicationService {
    private currentUser: User | null = null; // Conservé

    constructor(
        private auth: Auth, // Conservé
        private supabaseService: SupabaseService, // Injecté
        private cloudinaryService: CloudinaryService // Injecté
    ) {
        // Écoutez les changements d'état d'authentification pour obtenir l'utilisateur
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.currentUser = user;
            } else {
                this.currentUser = null;
            }
        });
    }

    async addPublication(
        publicationData: Omit< // Le type Omit peut être ajusté en fonction de ce que le formulaire fournit réellement
            Publication,
            "id" | "photoUrls" | "createdAt" | "userId" | "userDisplayName" // createdAt peut être géré par la DB
        >,
        photos: FileList
    ): Promise<Publication | null> { // Typage du retour pour Supabase (ou un type spécifique)
        if (!this.currentUser) {
            console.error("Utilisateur non authentifié pour ajouter une publication.");
            return Promise.reject("Utilisateur non authentifié.");
        }

        let uploadedPhotoUrls: string[] = [];
        try {
            // 1. Télécharger les images sur Cloudinary
            const uploadPromises = Array.from(photos).map(file =>
                this.cloudinaryService.uploadImage(file)
            );
            uploadedPhotoUrls = await Promise.all(uploadPromises);
        } catch (error) {
            console.error("Erreur lors de l'upload des images vers Cloudinary:", error);
            return Promise.reject("Erreur lors de l'upload des images.");
        }

        // 2. Préparer les données pour Supabase
        let finalEventDate: Date | string | null = null;
        if (publicationData.eventDate) {
            if (publicationData.eventDate instanceof Date) {
                finalEventDate = publicationData.eventDate.toISOString();
            } else if (typeof publicationData.eventDate === 'string') {
                // Si c'est déjà une chaîne, on suppose qu'elle est au bon format ou sera validée par Supabase
                // Idéalement, convertir en objet Date puis en ISO string pour normaliser
                const dateObj = new Date(publicationData.eventDate);
                if (!isNaN(dateObj.getTime())) {
                    finalEventDate = dateObj.toISOString();
                } else {
                    console.warn('Format de eventDate invalide:', publicationData.eventDate);
                    // Gérer le cas d'une date invalide, par exemple en la mettant à null ou en levant une erreur
                    finalEventDate = null;
                }
            }
        }


        // Assurez-vous que les noms de clés ici correspondent EXACTEMENT aux noms de colonnes dans Supabase
        const publicationToSaveForSupabase = {
            title: publicationData.title,
            type: publicationData.type,
            description: publicationData.description,
            content: publicationData.content,
            location: publicationData.location,
            photo_urls: uploadedPhotoUrls, // Supposant que la colonne est photo_urls (snake_case)
            user_id: this.currentUser.uid, // Supposant que la colonne est user_id (snake_case)
            user_display_name: this.currentUser.displayName || this.currentUser.email || "Utilisateur anonyme", // Supposant snake_case
            created_at: new Date().toISOString(), // ENVOYER EN SNAKE_CASE si la colonne est created_at
            event_date: finalEventDate, // Supposant que la colonne est event_date (snake_case)
        };
        // Le type Omit<Publication, "id"> est basé sur le modèle Publication.
        // Si les noms de colonnes DB sont différents, il faut un mappage ou un type différent pour l'objet envoyé.

        // Pour l'instant, nous allons supposer que votre modèle Publication utilise déjà les noms snake_case
        // ou que vous allez les ajuster. Si le modèle Publication utilise camelCase,
        // et la DB snake_case, le mappage ci-dessus est nécessaire.
        // Si votre table Supabase utilise camelCase (ex: createdAt), alors l'objet original était correct pour ce champ.

        // Pour être précis, si la table Supabase a `created_at`, `user_id`, `photo_urls`, `event_date`, `user_display_name`
        // et que votre modèle `Publication` a `createdAt`, `userId`, `photoUrls`, `eventDate`, `userDisplayName`
        // alors l'objet `publicationToSaveForSupabase` ci-dessus est correct.
        // L'appel à createPublication devrait alors prendre cet objet mappé.

        const publicationToSave: any = { // Utiliser 'any' temporairement pour flexibilité du mappage
            ...publicationData, // Ceci propage les champs du formulaire (qui sont camelCase)
            photoUrls: uploadedPhotoUrls, // camelCase du modèle
            userId: this.currentUser.uid, // camelCase du modèle
            userDisplayName: this.currentUser.displayName || this.currentUser.email || "Utilisateur anonyme", // camelCase du modèle
            // createdAt: new Date().toISOString(), // camelCase du modèle
            eventDate: finalEventDate, // camelCase du modèle

            // Mappage explicite vers snake_case pour Supabase si nécessaire :
            created_at: new Date().toISOString(), // snake_case pour la DB
            // Si d'autres champs du modèle sont camelCase mais snake_case dans la DB, mappez-les aussi.
            // Par exemple, si publicationData.eventDate est utilisé et que la DB a event_date:
            // event_date: finalEventDate,
        };
        // Retrait des champs camelCase qui ont été mappés en snake_case pour éviter les conflits
        // delete publicationToSave.createdAt; // Si vous avez mappé created_at
        // delete publicationToSave.eventDate; // Si vous avez mappé event_date


        // Simplifions en supposant que l'erreur est UNIQUEMENT sur createdAt et que la colonne DB est created_at
        // et que les autres champs du modèle correspondent aux colonnes DB ou sont gérés par Supabase.
        const dataForSupabase = {
            title: publicationData.title,
            type: publicationData.type,
            // Si votre colonne Supabase est 'descrption' et que publicationData a 'description':
            // descrption: publicationData.description,
            // Si votre colonne Supabase est 'description' et que publicationData a 'description':
            description: publicationData.description, // Assurez-vous que publicationData.description existe
            content: publicationData.content,
            location: publicationData.location,
            event_date: finalEventDate, // Correspond à la colonne Supabase 'event_date'
            photo_urls: uploadedPhotoUrls, // Correspond à la colonne Supabase 'photo_urls'
            user_id: this.currentUser.uid, // Correspond à la colonne Supabase 'user_id'
            user_display_name: this.currentUser.displayName || this.currentUser.email || "Utilisateur anonyme", // Correspond à la colonne Supabase 'user_display_name'
            createdAt: new Date().toISOString(), // Correspond à la colonne Supabase 'createdAt' (camelCase)
        };
        // Note: Si publicationData contient un champ 'descrption' et que la colonne est 'descrption',
        // alors la propagation avec ...publicationData pourrait fonctionner pour ce champ spécifique,
        // mais il est plus sûr de mapper explicitement chaque champ pour éviter les erreurs.

        try {
            // 3. Ajouter le document à Supabase
            // La méthode createPublication dans SupabaseService doit être créée
            // Elle devrait prendre dataForSupabase et retourner la publication insérée (ou son id)
            const newPublication = await this.supabaseService.createPublication(dataForSupabase);
            return newPublication;
        } catch (error) {
            console.error("Erreur lors de l'ajout de la publication à Supabase:", error);
            return Promise.reject("Erreur lors de la sauvegarde de la publication.");
        }
    }

    async getPublications(typeFilter?: 'publi' | 'agro' | ''): Promise<Publication[] | null> {
        try {
            return await this.supabaseService.getPublications(typeFilter);
        } catch (error) {
            console.error(`Erreur dans PublicationService lors de la récupération des publications (type: ${typeFilter || 'tout'}):`, error);
            // Vous pourriez vouloir retourner un tableau vide ou rejeter la promesse
            // en fonction de la manière dont vous voulez que les composants gèrent les erreurs.
            return null; // Ou throw error;
        }
    }

    // Vous pourrez ajouter ici d'autres méthodes (update, delete)
    // en utilisant this.supabaseService et potentiellement this.cloudinaryService si des images sont concernées.
}
