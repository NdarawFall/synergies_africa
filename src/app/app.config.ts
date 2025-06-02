import {
    ApplicationConfig,
    provideZoneChangeDetection,
    LOCALE_ID,
} from "@angular/core";
import { provideRouter, withInMemoryScrolling } from "@angular/router";
import { createClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js'; // Ajout pour Supabase et SupabaseClientOptions
// CloudinaryModule sera importé par les composants qui l'utilisent directement.
import { Cloudinary } from '@cloudinary/url-gen'; // Ajout pour Cloudinary config
import { routes } from "./app.routes";

// Imports pour Firebase (provider functions)
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";

import { environment } from "../environments/environment";

// Options pour le client Supabase
const supabaseOptions: SupabaseClientOptions<"public"> = {
    auth: {
        persistSession: false, // Firebase gère la session d'authentification
    }
};

// Création du client Supabase
export const supabaseInstance = createClient(environment.supabase.url, environment.supabase.key, supabaseOptions);

// Création de l'instance Cloudinary
export const cloudinaryInstance = new Cloudinary({
    cloud: {
        cloudName: environment.cloudinary.cloudName,
    },
    // Vous pouvez ajouter d'autres configurations globales ici si nécessaire,
    // par exemple, des transformations par défaut ou des configurations d'URL.
});

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: "top",
                anchorScrolling: "enabled",
            })
        ),
        { provide: LOCALE_ID, useValue: "fr-FR" },

        // Intégration directe des providers Firebase (Auth uniquement)
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),

        // Provider pour le client Supabase
        { provide: SupabaseClient, useValue: supabaseInstance },

        // Provider pour l'instance Cloudinary
        { provide: Cloudinary, useValue: cloudinaryInstance },
    ],
};
