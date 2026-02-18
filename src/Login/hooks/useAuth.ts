import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export const useAuth = () => {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        // 초기 유저
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
        })

        // 상태 변경 감지
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    return { user }
}
