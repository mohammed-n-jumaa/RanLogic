import React from 'react'
import {
  Globe, Github, Youtube, Instagram, Linkedin,
  Facebook, Twitch, Music2, ShoppingCart, Mail, Phone,
  MessageCircle, Send, Rss, BookOpen, Coffee, Heart,
  Briefcase, Camera, Code2, FileText, Link2, Play,
  Star, Zap, Award, Podcast, AtSign,
} from 'lucide-react'

const XIcon = ({ size = 16, color = "currentColor" }) => {
  return React.createElement(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: color,
    },
    React.createElement('path', {
      d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.741-8.855L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    })
  )
}

export const PROFILE_SOCIAL_ICONS = {
  instagram: { label: 'Instagram',   icon: Instagram,     color: '#e1306c' },
  tiktok:    { label: 'TikTok',      icon: Music2,        color: '#ff004f' },
  youtube:   { label: 'YouTube',     icon: Youtube,       color: '#ff0000' },
  twitter:   { label: 'Twitter / X', icon: XIcon,         color: '#ffffff', bgColor: '#000000' },
  linkedin:  { label: 'LinkedIn',    icon: Linkedin,      color: '#0077b5' },
  facebook:  { label: 'Facebook',    icon: Facebook,      color: '#1877f2' },
  github:    { label: 'GitHub',      icon: Github,        color: '#333333' },
  twitch:    { label: 'Twitch',      icon: Twitch,        color: '#9146ff' },
  telegram:  { label: 'Telegram',    icon: Send,          color: '#2aabee' },
  whatsapp:  { label: 'WhatsApp',    icon: MessageCircle, color: '#25d366' },
  discord:   { label: 'Discord',     icon: AtSign,        color: '#5865f2' },
  snapchat:  { label: 'Snapchat',    icon: Camera,        color: '#ffca28' },
  pinterest: { label: 'Pinterest',   icon: BookOpen,      color: '#bd081c' },
  website:   { label: 'Website',     icon: Globe,         color: '#6366f1' },
  podcast:   { label: 'Podcast',     icon: Podcast,       color: '#f59e0b' },
}

export const SOCIAL_ICONS = {
  globe:      { label: 'Website',       component: Globe        },
  link:       { label: 'Link',          component: Link2        },
  mail:       { label: 'Email',         component: Mail         },
  phone:      { label: 'Phone',         component: Phone        },
  rss:        { label: 'Blog/RSS',      component: Rss          },
  github:     { label: 'GitHub',        component: Github       },
  youtube:    { label: 'YouTube',       component: Youtube      },
  instagram:  { label: 'Instagram',     component: Instagram    },
  twitter:    { label: 'Twitter / X',   component: XIcon        },
  'twitter-x':{ label: 'Twitter / X',   component: XIcon        },
  x:          { label: 'Twitter / X',   component: XIcon        },
  linkedin:   { label: 'LinkedIn',      component: Linkedin     },
  facebook:   { label: 'Facebook',      component: Facebook     },
  twitch:     { label: 'Twitch',        component: Twitch       },
  tiktok:     { label: 'TikTok',        component: Music2       },
  telegram:   { label: 'Telegram',      component: Send         },
  whatsapp:   { label: 'WhatsApp',      component: MessageCircle},
  discord:    { label: 'Discord',       component: AtSign       },
  podcast:    { label: 'Podcast',       component: Podcast      },
  shop:       { label: 'Shop',          component: ShoppingCart },
  coffee:     { label: 'Buy me Coffee', component: Coffee       },
  book:       { label: 'Book',          component: BookOpen     },
  portfolio:  { label: 'Portfolio',     component: Briefcase    },
  blog:       { label: 'Blog',          component: FileText     },
  code:       { label: 'Code',          component: Code2        },
  camera:     { label: 'Photography',   component: Camera       },
  play:       { label: 'Media',         component: Play         },
  heart:      { label: 'Favourite',     component: Heart        },
  star:      { label: 'Featured',      component: Star         },
  zap:        { label: 'Fast / New',    component: Zap          },
  award:      { label: 'Achievement',   component: Award        },
}

export const ICON_GROUPS = [
  { label: 'Social Media',   keys: ['github','youtube','instagram','twitter','linkedin','facebook','twitch','tiktok','telegram','whatsapp','discord','podcast'] },
  { label: 'Web & Contact',  keys: ['globe','link','mail','phone','rss'] },
  { label: 'Commerce',       keys: ['shop','coffee'] },
  { label: 'Content & Work', keys: ['book','portfolio','blog','code','camera','play'] },
  { label: 'Misc',           keys: ['heart','star','zap','award'] },
]