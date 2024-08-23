import * as nanocss from '@/lib/nanocss'
import { fadeIn } from '../styles/animations'

export default function Home() {
  return (
    <main {...nanocss.props(styles.main)}>
      <h1 {...nanocss.props(styles.h1)}>Next.js + NanoCSS</h1>
      <p {...nanocss.props(styles.p)}>Hello, world!</p>
      <p {...nanocss.props(styles.theme)}>Text in primary color.</p>
      <p {...nanocss.props(theme, styles.theme)}>
        Text in primary color (with theme).
      </p>
      <p {...nanocss.props(theme, themeOverride, styles.theme)}>
        Text in primary color (with theme overrides).
      </p>
      <button {...nanocss.props(styles.dynamic(100))}>Dynamic width</button>
      <p {...nanocss.props(styles.fadeIn)}>Fade in animations</p>
    </main>
  )
}

const colors = nanocss.defineVars({
  primary: 'green',
})

const theme = nanocss.createTheme(colors, {
  primary: 'red',
})

const themeOverride = nanocss.createTheme(colors, {
  primary: 'blue',
})

const styles = nanocss.create({
  main: {
    padding: 16,
  },
  h1: {
    fontSize: 24,
  },
  p: {
    color: {
      default: 'black',
      ':hover': 'blue',
    },
  },
  theme: {
    color: colors.primary,
  },
  dynamic: (width: number) => ({
    width,
  }),
  fadeIn: {
    animationName: fadeIn,
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
  },
})
