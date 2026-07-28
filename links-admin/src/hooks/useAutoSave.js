import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

const useAutoSave = (value, saveFn, delay = 800) => {
  const isFirstRender = useRef(true)
  const timer = useRef(null)

  // حوّل الـ object إلى string حتى تشتغل المقارنة صح
  const serialized = JSON.stringify(value)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      const ok = await saveFn()
      if (ok) {
        toast.success('Changes saved', {
          id:       'autosave',
          duration: 1800,
          icon:     '✓',
          style:    { fontSize: '13px', padding: '8px 14px' },
        })
      } else {
        toast.error('Failed to save', { id: 'autosave-error', duration: 2500 })
      }
    }, delay)

    return () => clearTimeout(timer.current)
  }, [serialized, delay])
}

export default useAutoSave