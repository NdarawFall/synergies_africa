import { Injectable } from "@angular/core";
import { User } from "@supabase/supabase-js";
import { AuthService } from "./auth.service";
import { Publication } from "../models/publication.model";
import { SupabaseService } from "./supabase.service";
import { CloudinaryService } from "./cloudinary.service";

@Injectable({
    providedIn: "root",
})
export class PublicationService {
    private currentUser: User | null = null;

    constructor(
        private authService: AuthService,
        private supabaseService: SupabaseService,
        private cloudinaryService: CloudinaryService
    ) {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    async addPublication(
        publicationData: Omit<Publication, "id" | "photoUrls" | "userId" | "userDisplayName">,
        photos: FileList
    ): Promise<Publication | null> {
        if (!this.currentUser) {
            throw new Error("Utilisateur non authentifié.");
        }

        try {
            const uploadedPhotoUrls = await Promise.all(
                Array.from(photos).map(file => this.cloudinaryService.uploadImage(file))
            );

            const supabaseData = {
                title: publicationData.title,
                type: publicationData.type,
                description: publicationData.description,
                content: publicationData.content,
                location: publicationData.location,
                event_date: publicationData.eventDate instanceof Date 
                    ? publicationData.eventDate.toISOString() 
                    : publicationData.eventDate,
                photo_urls: uploadedPhotoUrls,
                user_id: this.currentUser?.id || '', // Garantir une valeur par défaut
                user_display_name: this.currentUser?.user_metadata?.['full_name'] || this.currentUser?.email || "Utilisateur anonyme",
                created_at: new Date().toISOString()
            };

            return await this.supabaseService.createPublication(supabaseData);
        } catch (error) {
            console.error("Erreur lors de la création de la publication:", error);
            throw error;
        }
    }

    async getPublications(typeFilter?: 'publi' | 'agro' | ''): Promise<Publication[]> {
        const publications = await this.supabaseService.getPublications(typeFilter);
        return publications || [];
    }
}
