'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const focusModeSchema = z.object({
  key: z.string().min(1, 'Key is required').max(30, 'Key must be less than 30 characters'),
  title: z.string().min(1, 'Title is required').max(30, 'Title must be less than 30 characters'),
  description: z.string().optional(),
  api_source: z.string().optional()
})

type FocusModeFormData = z.infer<typeof focusModeSchema>

interface FocusModeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (mode: any) => void
  editingMode: any
}

const FocusModeModal = ({ isOpen, onClose, onSave, editingMode }: FocusModeModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FocusModeFormData>({
    resolver: zodResolver(focusModeSchema),
    defaultValues: {
      key: '',
      title: '',
      description: '',
      api_source: ''
    }
  })

  useEffect(() => {
    if (editingMode) {
      reset({
        key: editingMode.key,
        title: editingMode.title,
        description: editingMode.description,
        api_source: editingMode.api_source
      })
    } else {
      reset({
        key: '',
        title: '',
        description: '',
        api_source: ''
      })
    }
  }, [editingMode, reset])

  const onSubmit = (data: FocusModeFormData) => {
    onSave({
      ...data,
      icon: 'Globe'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingMode ? 'Edit Focus Mode' : 'Add Focus Mode'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Key</label>
            <input
              type="text"
              {...register('key')}
              className={cn(
                "w-full px-3 py-2 rounded-lg border bg-light-primary dark:bg-dark-primary",
                errors.key ? "border-red-500" : "border-light-200 dark:border-dark-200"
              )}
            />
            {errors.key && <p className="mt-1 text-sm text-red-500">{errors.key.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              {...register('title')}
              className={cn(
                "w-full px-3 py-2 rounded-lg border bg-light-primary dark:bg-dark-primary",
                errors.title ? "border-red-500" : "border-light-200 dark:border-dark-200"
              )}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              {...register('description')}
              className="w-full px-3 py-2 rounded-lg border border-light-200 dark:border-dark-200 bg-light-primary dark:bg-dark-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">API Source</label>
            <input
              type="text"
              {...register('api_source')}
              className="w-full px-3 py-2 rounded-lg border border-light-200 dark:border-dark-200 bg-light-primary dark:bg-dark-primary"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-light-200 dark:border-dark-200 hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FocusModeModal