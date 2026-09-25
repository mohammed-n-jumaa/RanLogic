import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight, ArrowLeft, Play } from 'lucide-react';
import DOMPurify from 'dompurify';
import './HeroDesign5.scss';

const HeroDesign5 = ({ heroData }) => {
  const { isArabic } = useLanguage();
  const navigate = useNavigate();

  const { badge, main_title, sub_title, description, stats = [], cta_buttons = [], slides = [] } = heroData;

  const handleCta = (btn) => {
    if (!btn) return;
    btn.target_type === 'section' ? document.getElementById(btn.target_value)?.scrollIntoView({ behavior: 'smooth' }) : navigate(btn.target_value || '/auth');
  };
  const primaryBtn = cta_buttons.find(b => b.style === 'primary') || cta_buttons[0];
  const secondaryBtn = cta_buttons.find(b => b.style === 'secondary') || cta_buttons[1];

  // Use up to 6 slide images for cube faces
  const faces = ['f', 'b', 'r', 'l', 't', 'bo'];
  const faceImages = faces.map((_, i) => slides[i % slides.length]?.image_url).filter(Boolean);

  return (
    <section className="hd5" id="home">
      <div className="hd5-wrap">
        <div className="hd5-content">
          {badge && <div className="hd5-kicker">{badge}</div>}
          <h1 className="hd5-title">{main_title}</h1>
          {sub_title && <p className="hd5-sub">{sub_title}</p>}
          {description && <p className="hd5-desc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} />}
          <div className="hd5-btns">
            {primaryBtn ? <button className="hd5-btn hd5-btn--primary" onClick={() => handleCta(primaryBtn)}><span>{primaryBtn.label}</span>{isArabic ? <ArrowLeft size={16}/> : <ArrowRight size={16}/>}</button>
             : <button className="hd5-btn hd5-btn--primary" onClick={() => navigate('/auth')}><span>{isArabic ? 'ابدأ الآن' : 'Start Now'}</span>{isArabic ? <ArrowLeft size={16}/> : <ArrowRight size={16}/>}</button>}
            {secondaryBtn ? <button className="hd5-btn hd5-btn--secondary" onClick={() => handleCta(secondaryBtn)}><Play size={14}/><span>{secondaryBtn.label}</span></button>
             : <button className="hd5-btn hd5-btn--secondary" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}><Play size={14}/><span>{isArabic ? 'استكشف البرامج' : 'Explore Programs'}</span></button>}
          </div>
          {stats.length > 0 && (
            <div className="hd5-stats">
              {stats.map((s, i) => (
                <div key={i} className="hd5-stat"><div className="hd5-stat__v">{s.value}</div><div className="hd5-stat__l">{s.label}</div></div>
              ))}
            </div>
          )}
        </div>
        <div className="hd5-cube-area">
          <div className="hd5-orbit"><div className="hd5-orbit__dot" /></div>
          <div className="hd5-cube">
            {faceImages.map((src, i) => (
              <div key={i} className={`hd5-face hd5-face--${faces[i]}`}><img src={src} alt="" /></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroDesign5;
