import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, Zap } from 'lucide-react'
import useAuthStore from '@/store/useAuthStore'
import styles from './Login.module.css'

const Login = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    const ok = await login(email, password)
    if (!ok) {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />

      <div className={`${styles.card} ${shaking ? styles.shake : ''}`}>

        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <Zap size={20} />
          </div>
          <span className={styles.brandName}>LinkAdmin</span>
        </div>

        <div className={styles.heading}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.sub}>Sign in to manage your links</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError() }}
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <div className={styles.passwordWrap}>
              <input
                id="password"
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError() }}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass((p) => !p)}
                tabIndex={-1}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className={styles.errorMsg} role="alert">
              {error}
            </p>
          )}

          <button
            className={styles.submitBtn}
            type="submit"
            disabled={isLoading || !email || !password}
          >
            {isLoading
              ? <span className={styles.spinner} />
              : <><LogIn size={16} /> Sign in</>
            }
          </button>

        </form>

        
      </div>
    </div>
  )
}

export default Login