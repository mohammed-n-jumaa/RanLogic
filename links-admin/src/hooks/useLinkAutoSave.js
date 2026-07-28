import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

const useLinkAutoSave = (saving) => {
  const prevSaving = useRef(false)

  useEffect(() => {
    if (prevSaving.current && !saving) {
      toast.success('Changes saved', {
        id:       'autosave',
        duration: 1800,
        icon:     '✓',
        style:    { fontSize: '13px', padding: '8px 14px' },
      })
    }
    prevSaving.current = saving
  }, [saving])
}

export default useLinkAutoSave