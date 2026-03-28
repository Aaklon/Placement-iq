'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/useUser'
import { motion, AnimatePresence } from 'framer-motion'

export default function Leaderboard() {
  const { user } = useUser()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, user_id, ready_companies, cgpa')

    if (error) {
      console.error('Error fetching students:', error)
      return
    }

    // Sort by ready_companies length DESC, then CGPA DESC
    const sorted = (data || []).sort((a, b) => {
      const aLen = (a.ready_companies || []).length
      const bLen = (b.ready_companies || []).length
      if (aLen !== bLen) return bLen - aLen
      return (b.cgpa || 0) - (a.cgpa || 0)
    })

    setStudents(sorted.slice(0, 10))
    setLoading(false)
  }

  useEffect(() => {
    fetchStudents()

    // Real-time subscription
    const channel = supabase
      .channel('students-leaderboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        () => {
          fetchStudents()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006633]"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800 bg-gray-950/50">
        <h3 className="text-sm font-medium text-gray-100 flex items-center justify-between">
          Student Leaderboard
          <span className="text-xs text-gray-500 font-normal">Top 10 Readiness</span>
        </h3>
      </div>

      <div className="divide-y divide-gray-800">
        <AnimatePresence>
          {students.map((student, index) => {
            const isCurrentUser = user && student.user_id === user.id
            const readyCount = (student.ready_companies || []).length
            const readinessPercent = Math.round((readyCount / 53) * 100)

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between px-4 py-3 ${
                  isCurrentUser ? 'bg-purple-900/40 border-l-4 border-purple-600' : 'hover:bg-gray-800/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 text-xs font-medium ${index < 3 ? 'text-[#006633]' : 'text-gray-500'}`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-200">
                      {student.name}
                      {isCurrentUser && <span className="ml-2 text-[10px] bg-purple-700 px-1.5 py-0.5 rounded uppercase">You</span>}
                    </div>
                    <div className="text-xs text-gray-500">CGPA: {student.cgpa || 'N/A'}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-gray-100">{readinessPercent}%</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Ready</div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {students.length === 0 && (
        <div className="p-8 text-center text-sm text-gray-500">
          No records found. Be the first to analyze!
        </div>
      )}
    </div>
  )
}
