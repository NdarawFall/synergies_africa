import { Injectable } from '@angular/core';
import { SupabaseClient, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Publication } from '../models/publication.model'; // Importer le modèle

// Interface pour les données envoyées à la méthode d'insertion de Supabase
// Doit correspondre aux noms de colonnes de la table Supabase
export interface PublicationInsertData {
  title: string;
  type: "publi" | "agro" | "";
  description?: string; // Ou descrption si c'est le nom de la colonne
  content: string;
  location: string;
  event_date: string | null;
  photo_urls: string[];
  user_id: string;
  user_display_name: string;
  createdAt: string; // Correspond à votre colonne Supabase 'createdAt'
  // Ajoutez d'autres champs si nécessaire, en respectant la casse de vos colonnes DB
}


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  constructor(private supabase: SupabaseClient) { }

  async createPublication(publicationData: PublicationInsertData): Promise<Publication | null> {
    // publicationData est maintenant l'objet avec les clés mappées (snake_case et createdAt)
    // Assurez-vous que le nom de la table 'publications' correspond à votre table dans Supabase
    const { data, error } = await this.supabase
      .from('publications')
      .insert([publicationData]) // publicationData a maintenant les clés attendues par la DB
      .select() // Pour retourner l'enregistrement inséré
      .single(); // Si vous vous attendez à un seul enregistrement retourné

    if (error) {
      console.error('Erreur lors de la création de la publication dans Supabase:', error);
      throw error; // Ou retournez null ou un objet d'erreur spécifique
    }
    // IMPORTANT: Si Supabase retourne les clés en snake_case (ex: created_at, user_id)
    // et que votre modèle Publication est en camelCase (createdAt, userId),
    // vous devrez mapper les clés de 'data' ici avant de le retourner comme 'Publication'.
    // Par exemple:
    // if (data) {
    //   return {
    //     id: data.id,
    //     title: data.title,
    //     type: data.type,
    //     description: data.description, // ou data.descrption si c'est le nom de la colonne
    //     content: data.content,
    //     location: data.location,
    //     eventDate: data.event_date ? new Date(data.event_date) : null,
    //     photoUrls: data.photo_urls || [],
    //     createdAt: data.createdAt ? new Date(data.createdAt) : undefined, // ou data.created_at
    //     userId: data.user_id,
    //     userDisplayName: data.user_display_name
    //   } as Publication;
    // }
    return data as Publication | null; // Ce casting peut être incorrect si les casses ne correspondent pas.
  }

  async getPublications(typeFilter?: 'publi' | 'agro' | ''): Promise<Publication[] | null> {
    let query = this.supabase.from('publications').select('*');

    if (typeFilter) {
      query = query.eq('type', typeFilter);
    }

    // Vous pouvez ajouter d'autres filtres ou tris ici, par exemple :
    // query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des publications depuis Supabase:', error);
      throw error; // Ou retournez null ou un objet d'erreur spécifique
    }
    return data as Publication[] | null; // Assurez-vous que le casting est sûr ou validez les données
  }

  // Vous ajouterez ici d'autres méthodes pour :
  // - Lire des enregistrements (read) - comme l'exemple ci-dessus
  // - Mettre à jour des enregistrements (update)
  // - Supprimer des enregistrements (delete)
}