import { Injectable, inject } from "@angular/core";
import { Observable, BehaviorSubject, from } from "rxjs";
import { map } from 'rxjs/operators';
import { SupabaseService } from "./supabase.service";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private supabaseService: SupabaseService) {
        this.supabaseService.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
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
