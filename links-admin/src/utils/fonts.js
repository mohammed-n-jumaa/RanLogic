export const FONT_GROUPS = [
  {
    label: 'Display / Modern',
    fonts: [
      { name: 'Syne',          label: 'Syne'          },
      { name: 'Space Grotesk', label: 'Space Grotesk' },
      { name: 'Outfit',        label: 'Outfit'        },
      { name: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
      { name: 'Exo 2',        label: 'Exo 2'         },
      { name: 'Orbitron',      label: 'Orbitron'      },
      { name: 'Rajdhani',      label: 'Rajdhani'      },
      { name: 'Audiowide',     label: 'Audiowide'     },
    ],
  },
  {
    label: 'Elegant / Serif',
    fonts: [
      { name: 'Playfair Display', label: 'Playfair Display' },
      { name: 'Cormorant Garamond', label: 'Cormorant Garamond' },
      { name: 'Libre Baskerville', label: 'Libre Baskerville' },
      { name: 'Lora',            label: 'Lora'           },
      { name: 'DM Serif Display', label: 'DM Serif Display' },
      { name: 'Merriweather',    label: 'Merriweather'   },
      { name: 'EB Garamond',     label: 'EB Garamond'    },
    ],
  },
  {
    label: 'Clean / Sans-Serif',
    fonts: [
      { name: 'DM Sans',        label: 'DM Sans'       },
      { name: 'Nunito',         label: 'Nunito'        },
      { name: 'Poppins',        label: 'Poppins'       },
      { name: 'Rubik',          label: 'Rubik'         },
      { name: 'Manrope',        label: 'Manrope'       },
      { name: 'Inter',          label: 'Inter'         },
      { name: 'Work Sans',      label: 'Work Sans'     },
      { name: 'Mulish',         label: 'Mulish'        },
    ],
  },
  {
    label: 'Handwriting / Script',
    fonts: [
      { name: 'Pacifico',       label: 'Pacifico'      },
      { name: 'Dancing Script', label: 'Dancing Script' },
      { name: 'Caveat',         label: 'Caveat'        },
      { name: 'Satisfy',        label: 'Satisfy'       },
      { name: 'Righteous',      label: 'Righteous'     },
      { name: 'Lobster',        label: 'Lobster'       },
      { name: 'Kalam',          label: 'Kalam'         },
    ],
  },
  {
    label: 'Monospace / Tech',
    fonts: [
      { name: 'JetBrains Mono', label: 'JetBrains Mono' },
      { name: 'Fira Code',      label: 'Fira Code'     },
      { name: 'Source Code Pro', label: 'Source Code Pro' },
      { name: 'IBM Plex Mono',  label: 'IBM Plex Mono' },
      { name: 'Roboto Mono',    label: 'Roboto Mono'   },
      { name: 'Space Mono',     label: 'Space Mono'    },
    ],
  },
  {
    label: 'Arabic / RTL',
    fonts: [
      { name: 'Cairo',          label: 'Cairo'         },
      { name: 'Tajawal',        label: 'Tajawal'       },
      { name: 'Almarai',        label: 'Almarai'       },
      { name: 'Noto Kufi Arabic', label: 'Noto Kufi Arabic' },
      { name: 'Amiri',          label: 'Amiri'         },
      { name: 'Scheherazade New', label: 'Scheherazade New' },
    ],
  },
]

export const ALL_FONTS = FONT_GROUPS.flatMap((g) => g.fonts)

export const buildGoogleFontsUrl = () => {
  const families = ALL_FONTS.map((f) =>
    `family=${encodeURIComponent(f.name)}:wght@400;500;600;700`
  ).join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}
