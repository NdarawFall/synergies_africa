import { Injectable } from '@angular/core';
import { SupabaseClient, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Publication } from '../models/publication.model'; // Importer le modèle

// Interface pour les données ENVOYÉES à la méthode d'insertion de Supabase
// Doit correspondre aux NOMS DE COLONNES de la table Supabase
export interface PublicationInsertData {
  title: string;
  type: 'publi' | 'agro' | '';
  description?: string;
  content: string;
  location: string;
  event_date: string | null;
  photo_urls: string[];
  user_id: string;
  user_display_name: string;
  created_at: string; // Correction: utiliser snake_case pour la cohérence
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  constructor(public supabase: SupabaseClient) {}

  async createPublication(
    publicationData: PublicationInsertData
  ): Promise<Publication | null> {
    // publicationData a maintenant les clés qui correspondent aux noms de colonnes DB
    const { data, error } = await this.supabase
      .from('publications') // Assurez-vous que le nom de la table est correct
      .insert([publicationData])
      .select() // Pour retourner l'enregistrement inséré
      .single(); // Si vous vous attendez à un seul enregistrement retourné

    if (error) {
      console.error('Erreur Supabase lors de la création:', error);
      // Lancer une erreur plus spécifique
      throw new Error(
        `Échec de la création de la publication dans Supabase: ${error.message}`
      );
    }

    // Mapper les données retournées par Supabase (noms de colonnes DB)
    // vers le modèle Angular (camelCase)
    // Dans la méthode createPublication, modifier le mapping :
    if (data) {
      return {
        id: data.id,
        title: data.title,
        type: data.type,
        description: data.description,
        content: data.content,
        location: data.location,
        eventDate: data.event_date ? new Date(data.event_date) : null,
        photoUrls: data.photo_urls || [],
        createdAt: data.created_at ? new Date(data.created_at) : undefined, // Correction: utiliser created_at
        userId: data.user_id,
        userDisplayName: data.user_display_name,
      } as Publication;
    }

    return null;
  }

  async getPublications(
    typeFilter?: 'publi' | 'agro' | ''
  ): Promise<Publication[] | null> {
    let query = this.supabase.from('publications').select('*'); // Sélectionne toutes les colonnes

    if (typeFilter) {
      query = query.eq('type', typeFilter);
    }

    // Vous pouvez ajouter d'autres filtres ou tris ici, par exemple :
    // Dans la méthode getPublications, modifier le tri :
    query = query.order('created_at', { ascending: false }); // Correction: utiliser created_at

    const { data, error } = await query;

    if (error) {
      console.error('Erreur Supabase lors de la récupération:', error);
      // Lancer une erreur plus spécifique
      throw new Error(
        `Échec de la récupération des publications depuis Supabase: ${error.message}`
      );
    }

    // Mapper les données retournées par Supabase (noms de colonnes DB)
    // vers le modèle Angular (camelCase)
    return (
      data?.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        description: item.description,
        content: item.content,
        location: item.location,
        eventDate: item.event_date ? new Date(item.event_date) : null,
        photoUrls: item.photo_urls || [],
        createdAt: item.created_at ? new Date(item.created_at) : undefined, // Correction: utiliser created_at au lieu de createdAt
        userId: item.user_id,
        userDisplayName: item.user_display_name,
      })) || null
    );
  }

  // Vous ajouterez ici d'autres méthodes (update, delete)
  // NOUVELLE MÉTHODE À AJOUTER ICI
  async getPublicationById(id: string): Promise<Publication | null> {
    const { data, error } = await this.supabase
      .from('publications') // Le nom de votre table
      .select(
        `
        id,
        title,
        type,
        description,
        content,
        location,
        eventDate: event_date,
        photoUrls: photo_urls,
        createdAt: created_at,
        userId: user_id,
        userDisplayName: user_display_name
      `
      )
      .eq('id', id)
      .single(); // .single() est parfait : il retourne un objet ou une erreur s'il ne trouve pas exactement 1 résultat.

    if (error) {
      // Si l'erreur est que l'enregistrement n'a pas été trouvé (code P0GRST01), ce n'est pas une erreur critique.
      if (error.code === 'PGRST116') {
        // Correction du code d'erreur, PGRST116 signifie 0 ou plus d'1 ligne retournée pour single()
        console.warn(`Aucune publication trouvée avec l'ID: ${id}`);
        return null; // On retourne null, le composant saura gérer
      }
      // Pour les autres erreurs, on les logue et on les lance.
      console.error(
        'Erreur Supabase lors de la récupération de la publication par ID:',
        error
      );
      throw error;
    }

    // On s'assure que le format des données correspond bien au modèle Publication
    return data as Publication;
  }
  // Add method to insert Firebase user
}
