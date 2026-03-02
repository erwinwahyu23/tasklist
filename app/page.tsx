'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: number
  completedAt?: number | null
}

type FilterType = 'all' | 'active' | 'completed'

export default function Tasklist() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error('Error parsing tasks:', error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() === '') return

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    }

    setTasks([newTask, ...tasks])
    setInputValue('')
  }

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? Date.now() : null }
          : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const activeTasksCount = tasks.filter((task) => !task.completed).length
  const completedTasksCount = tasks.filter((task) => task.completed).length

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Tasklist</h1>
          <p className="text-slate-500">Kelola tugas harian Anda dengan mudah</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Input Section */}
          <div className="p-6 border-b border-slate-100">
            <form onSubmit={addTask} className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tambahkan tugas baru..."
                className="w-full px-4 py-3 pr-12 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={inputValue.trim() === ''}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-1 p-4 bg-slate-50 border-b border-slate-100">
            {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === filterType
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                {filterType === 'all' && 'Semua'}
                {filterType === 'active' && 'Aktif'}
                {filterType === 'completed' && 'Selesai'}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">
                  {filter === 'all'
                    ? 'Belum ada tugas. Tambahkan tugas pertama Anda!'
                    : filter === 'active'
                    ? 'Tidak ada tugas aktif'
                    : 'Tidak ada tugas yang selesai'}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    className="group flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors duration-200"
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        task.completed
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'border-slate-300 hover:border-indigo-400'
                      }`}
                    >
                      {task.completed && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Task Text and Dates */}
                    <div className="flex-grow min-w-0">
                      <span
                        className={`block text-xs sm:text-sm transition-all duration-200 ${
                          task.completed
                            ? 'text-slate-400'
                            : 'text-slate-700'
                        }`}
                      >
                        {task.text}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span>Dibuat: {new Date(task.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
                        {task.completed && task.completedAt && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">
                              Selesai: {new Date(task.completedAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Hapus tugas"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer Stats */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
            <span>
              {activeTasksCount} tugas aktif
              {completedTasksCount > 0 && ` · ${completedTasksCount} selesai`}
            </span>
            {completedTasksCount > 0 && (
              <button
                onClick={() => setTasks(tasks.filter((t) => !t.completed))}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
              >
                Hapus tugas selesai
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-400">
          <p>Data tersimpan di browser Anda</p>
        </div>
      </div>
    </div>
  )
}
