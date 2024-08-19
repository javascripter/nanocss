import { html, css } from 'react-strict-dom'
import { colors } from '../styles/colors.stylex'

export default function Home() {
  return (
    <html.main style={styles.main}>
      <html.h1 style={styles.h1}>Next.js + NanoCSS</html.h1>
      <html.p style={styles.p}>Hello, world!</html.p>
      <html.p style={styles.theme}>Text in primary color.</html.p>
      <html.button style={styles.dynamic(100)}>Dynamic width</html.button>
    </html.main>
  )
}

const styles = css.create({
  main: {
    padding: 16,
  },
  h1: {
    fontSize: 24,
  },
  p: {
    color: 'green',
  },
  theme: {
    color: colors.primary,
  },
  dynamic: (width: number) => ({
    width,
    color: {
      default: 'black',
      ':hover': 'blue',
    },
  }),
})
