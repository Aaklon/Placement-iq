'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ProgressTracker({ tasks = [], planId }) {
  const [checkedItems, setCheckedItems] = useState({})
  const storageKey = `placementiq_${planId}`

  // Load from local storage
  useEffect(() => {
    if (!planId) return
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse progress', e)
      }
    }
  }, [planId, storageKey])

  // Save to local storage
  const handleToggle = (taskId) => {
    const newChecked = {
      ...checkedItems,
      [taskId]: !checkedItems[taskId]
    }
    setCheckedItems(newChecked)
    localStorage.setItem(storageKey, JSON.stringify(newChecked))
  }

  if (!tasks.length) return null

  const checkedCount = tasks.filter((t, i) => checkedItems[i]).length
  const totalCount = tasks.length
  const progressPercent = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0
  
  // Assuming each task is roughly equal weight for hours if not specified
  // Or if we have hours, we can sum them up. 
  // For now, let's stick to count as per the instructions "X of Y hours" 
  // but if the data doesn't have hours, I'll just show "X of Y tasks" or assume 1 hr per task.
  const totalHours = tasks.reduce((acc, t) => acc + (t.hours || 1), 0)
  const completedHours = tasks.reduce((acc, t, i) => acc + (checkedItems[i] ? (t.hours || 1) : 0), 0)

  return (
    <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6">
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-sm font-medium text-gray-100">Overall Progress</h3>
          <span className="text-xs text-gray-400">
            {completedHours} of {totalHours} hours completed
          </span>
        </div>
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 1 }}
            className="h-full bg-[#006633]"
          />
        </div>
      </div>

      <div className="space-y-1">
        {tasks.map((task, index) => (
          <div
            key={index}
            onClick={() => handleToggle(index)}
            className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors min-h-[44px]"
          >
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={!!checkedItems[index]}
                onChange={() => {}} // Controlled by parent div click
                className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-[#006633] focus:ring-[#006633] cursor-pointer"
              />
            </div>
            <span
              className={`text-sm transition-all ${
                checkedItems[index] ? 'text-gray-500 line-through' : 'text-gray-300'
              }`}
            >
              {task.taskText || task.name || task}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
