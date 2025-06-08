import { Injectable, inject } from "@angular/core";
import { Observable, BehaviorSubject, from } from "rxjs";
import { map } from 'rxjs/operators';
import { SupabaseService } from "./supabase.service";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

    constructor(private supabaseService: SupabaseService) {
    // Vérifie si un token existe au démarrage
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
        // Optionnel : rafraîchir la session ou simplement charger l'utilisateur
        this.supabaseService.supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
            this.currentUserSubject.next(data.session.user);
        }
        });
    }

    // Écoute les changements d'état
    this.supabaseService.supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
        this.currentUserSubject.next(session.user);
        } else if (event === 'SIGNED_OUT') {
        this.currentUserSubject.next(null);
        }
    });
    }

    googleSignIn(): Observable<any> {
        return from(this.supabaseService.supabase.auth.signInWithOAuth({
            provider: 'google'
        }));
    }

    signOut(): Observable<any> {
        return from(this.supabaseService.supabase.auth.signOut());
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    isLoggedIn(): Observable<boolean> {
        return this.currentUser$.pipe(map(user => !!user));
    }

}
