import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://itlalwncrtuxmbmeoeei.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bGFsd25jcnR1eG1ibWVvZWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDkyODIsImV4cCI6MjA4Njk4NTI4Mn0.JRLJ5X9IIoPel0_HlTweJoUbIP1tqvuFoChJsYyWgo8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})