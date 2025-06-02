import { Injectable } from '@angular/core';
import { Cloudinary } from '@cloudinary/url-gen';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  // cloudinaryInstance sera initialisée par l'injection de dépendance
  // constructor(private cloudinaryInstance: Cloudinary) {}
  // Cependant, pour la méthode d'upload actuelle qui utilise fetch,
  // nous n'avons pas besoin de stocker l'instance si elle n'est utilisée que pour des transformations futures.
  // Pour l'instant, nous pouvons simplifier et ne pas la déclarer si elle n'est pas utilisée.
  // OU, nous l'injectons pour une utilisation future. Optons pour l'injection.

  constructor(private cloudinaryInstance: Cloudinary) {
    // L'instance Cloudinary configurée globalement est maintenant disponible ici
    // via this.cloudinaryInstance si vous souhaitez l'utiliser pour générer des URLs
    // avec des transformations par exemple.
  }

  // Méthode pour uploader un fichier vers Cloudinary en utilisant un Upload Preset (non signé)
  // Retourne une promesse avec l'URL de l'image uploadée ou une erreur.
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);
    // Assurez-vous que votre uploadPreset est configuré pour les uploads non signés dans Cloudinary

    const uploadUrl = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.error) {
        console.error('Erreur Cloudinary:', data.error.message);
        throw new Error(`Erreur Cloudinary: ${data.error.message}`);
      }

      // data.secure_url est généralement l'URL HTTPS de l'image
      return data.secure_url;
    } catch (error) {
      console.error('Erreur lors de l\'upload vers Cloudinary:', error);
      throw error;
    }
  }

  // Vous pouvez ajouter d'autres méthodes ici, par exemple pour :
  // - Générer des URLs d'images avec transformations (en utilisant l'instance Cloudinary injectée)
  // - Gérer la suppression d'images (nécessitera une API signée ou une fonction backend)
}