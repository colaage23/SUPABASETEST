import { supabase } from "../lib/supabase";


export const signUpApi = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    return { data, error }
}

export const signInApi = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    return { data, error }
}

export const signOutApi = async () => {
    await supabase.auth.signOut()
}
