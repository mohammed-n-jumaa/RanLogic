import { useState, useCallback, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus, GripVertical, Pencil, Trash2,
  X, MousePointerClick, Link2,
} from 'lucide-react'
import useLinkStore    from '@/store/useLinkStore'
import useLinkAutoSave from '@/hooks/useLinkAutoSave'
import Toggle          from '@/components/ui/Toggle'
import IconPicker      from '@/components/ui/IconPicker'
import FontPicker      from '@/components/ui/FontPicker'
import { SOCIAL_ICONS } from '@/utils/socialIcons'
import styles from './Links.module.css'

const EMPTY_LINK = { title: '', url: '', icon: 'globe', active: true, titleFont: 'DM Sans' }

const Links = () => {
  const {
    links, loading, saving,
    fetchLinks, addLink, updateLink, deleteLink, toggleLink, reorderLinks,
  } = useLinkStore()

  const [modal,    setModal]    = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [form,     setForm]     = useState(EMPTY_LINK)
  const [errors,   setErrors]   = useState({})

  useLinkAutoSave(saving)

  useEffect(() => { fetchLinks() }, [fetchLinks])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = links.findIndex((l) => l.id === active.id)
    const newIndex = links.findIndex((l) => l.id === over.id)
    const reordered = arrayMove(links, oldIndex, newIndex).map((l, i) => ({ ...l, order: i }))
    reorderLinks(reordered)
  }, [links, reorderLinks])

  const openAdd = () => {
    setForm({ ...EMPTY_LINK })
    setErrors({})
    setModal({ mode: 'add' })
  }

  const openEdit = (link) => {
    setForm({ ...link })
    setErrors({})
    setModal({ mode: 'edit', id: link.id })
  }

  const closeModal = () => setModal(null)

  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title = 'Title is required'
    if (!form.url.trim())         e.url   = 'URL is required'
    else if (!/^https?:\/\/.+/.test(form.url.trim()))
                                  e.url   = 'Must start with http:// or https://'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    const payload = { ...form, title: form.title.trim(), url: form.url.trim() }
    const result  = modal.mode === 'add'
      ? await addLink(payload)
      : await updateLink(modal.id, payload)

    if (result.success) {
      closeModal()
    } else if (result.errors) {
      const mapped = {}
      if (result.errors.title) mapped.title = result.errors.title[0]
      if (result.errors.url)   mapped.url   = result.errors.url[0]
      setErrors(mapped)
    }
  }

  const confirmDelete = (id) => setDeleteId(id)

  const handleDelete = async () => {
    await deleteLink(deleteId)
    setDeleteId(null)
  }

  const sorted = [...links].sort((a, b) => a.order - b.order)

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>Loading links…</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      <div className={styles.topBar}>
        <div className={styles.meta}>
          <span className={styles.count}>{links.length} links</span>
          <span className={styles.dot} />
          <span className={styles.activeCount}>{links.filter((l) => l.active).length} active</span>
        </div>
        <button className={styles.addBtn} onClick={openAdd} disabled={saving}>
          <Plus size={16} /> Add Link
        </button>
      </div>

      {links.length > 1 && (
        <p className={styles.dragHint}>
          <GripVertical size={13} /> Drag the handle to reorder links
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sorted.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className={styles.list}>
            {sorted.map((link, index) => (
              <SortableLinkRow
                key={link.id}
                link={link}
                index={index}
                onEdit={() => openEdit(link)}
                onDelete={() => confirmDelete(link.id)}
                onToggle={() => toggleLink(link.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {links.length === 0 && (
        <div className={styles.empty}>
          <Link2 size={40} strokeWidth={1} />
          <p>No links yet. Add your first one!</p>
          <button className={styles.addBtn} onClick={openAdd}>
            <Plus size={15} /> Add Link
          </button>
        </div>
      )}

      {modal && (
        <>
          <div className={styles.backdrop} onClick={closeModal} />
          <div className={styles.modal} role="dialog" aria-modal="true">

            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modal.mode === 'add' ? 'Add New Link' : 'Edit Link'}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X size={16} />
              </button>
            </div>

            <div className={styles.modalBody}>

              <div className={styles.formRow}>
                <label className={styles.formLabel}>Icon</label>
                <IconPicker
                  value={form.icon}
                  onChange={(icon) => setForm((p) => ({ ...p, icon }))}
                />
              </div>

              <div className={styles.formRow}>
                <label className={styles.formLabel}>Title *</label>
                <input
                  className={`${styles.input} ${errors.title ? styles.inputErr : ''}`}
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. My YouTube Channel"
                  style={{ fontFamily: `'${form.titleFont}', sans-serif` }}
                />
                {errors.title && <span className={styles.errMsg}>{errors.title}</span>}
                <div className={styles.fontRow}>
                  <span className={styles.fontLabel}>🔤 Title Font</span>
                  <FontPicker
                    value={form.titleFont || 'DM Sans'}
                    onChange={(f) => setForm((p) => ({ ...p, titleFont: f }))}
                    previewText={form.title || 'Link title'}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label className={styles.formLabel}>URL *</label>
                <input
                  className={`${styles.input} ${errors.url ? styles.inputErr : ''}`}
                  value={form.url}
                  onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://example.com"
                  type="url"
                />
                {errors.url && <span className={styles.errMsg}>{errors.url}</span>}
              </div>

              <div className={`${styles.formRow} ${styles.toggleRow}`}>
                <div>
                  <label className={styles.formLabel}>Active</label>
                  <p className={styles.toggleSub}>Show this link on your public page</p>
                </div>
                <Toggle
                  checked={form.active}
                  onChange={(v) => setForm((p) => ({ ...p, active: v }))}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal} disabled={saving}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : modal.mode === 'add' ? 'Add Link' : 'Save Changes'}
              </button>
            </div>
          </div>
        </>
      )}

      {deleteId && (
        <>
          <div className={styles.backdrop} onClick={() => setDeleteId(null)} />
          <div className={`${styles.modal} ${styles.confirmModal}`} role="alertdialog">
            <div className={styles.confirmIcon}>🗑️</div>
            <h3 className={styles.confirmTitle}>Delete Link?</h3>
            <p className={styles.confirmSub}>This action cannot be undone.</p>
            <div className={styles.confirmBtns}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)} disabled={saving}>
                Cancel
              </button>
              <button className={styles.deleteBtn} onClick={handleDelete} disabled={saving}>
                {saving ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  )
}

const SortableLinkRow = ({ link, index, onEdit, onDelete, onToggle }) => {
  const {
    attributes, listeners,
    setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex:  isDragging ? 999 : 'auto',
  }

  const IconComp = SOCIAL_ICONS[link.icon]?.component || Link2

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.row} ${!link.active ? styles.rowInactive : ''} ${isDragging ? styles.rowDragging : ''}`}
    >
      <span className={styles.orderNum}>{index + 1}</span>

      <button
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        aria-label="Drag handle"
      >
        <GripVertical size={16} />
      </button>

      <div className={styles.linkIcon}>
        <IconComp size={18} />
      </div>

      <div className={styles.linkInfo}>
        <p
          className={styles.linkTitle}
          style={{ fontFamily: `'${link.titleFont || 'DM Sans'}', sans-serif` }}
        >
          {link.title}
        </p>
        <p className={styles.linkUrl}>{link.url}</p>
      </div>

      <div className={styles.clicksBadge} title="Total clicks">
        <MousePointerClick size={11} />
        {link.clicks}
      </div>

      <Toggle checked={link.active} onChange={onToggle} size="sm" />

      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={onEdit} title="Edit">
          <Pencil size={14} />
        </button>
        <button className={`${styles.actionBtn} ${styles.deleteAction}`} onClick={onDelete} title="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default Links