// L'import de Timestamp de Firebase n'est plus nécessaire

export interface Publication {
    id?: string; // Optionnel, sera généré par Supabase/PostgreSQL
    title: string;
    type: "publi" | "agro" | ""; // 'publi-reportage' et 'agro-echo'
    description: string;
    content: string;
    location: string;
    eventDate: Date | string | null; // Date de l'événement (string pour ISO, null si optionnel)
    photoUrls: string[]; // URLs des images stockées sur Cloudinary
    createdAt?: Date | string; // Date de création du document (optionnel si géré par DB)
    userId: string; // ID de l'utilisateur qui a créé la publication
    userDisplayName?: string; // Nom d'affichage de l'utilisateur
}
