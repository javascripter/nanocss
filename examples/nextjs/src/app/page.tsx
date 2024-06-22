import * as nanocss from '@/lib/nanocss'

export default function Home() {
  return (
    <main {...nanocss.props(styles.main)}>
      <h1 {...nanocss.props(styles.h1)}>Next.js + NanoCSS</h1>
      <p {...nanocss.props(styles.p)}>Hello, world!</p>
    </main>
  )
}

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
})
