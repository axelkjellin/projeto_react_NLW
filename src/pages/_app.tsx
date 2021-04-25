import {Header} from "../components/Header";
import {Player} from "../components/Player";
import { PlayerContextProvider } from '../contexts/PlayerContext';



import '../styles/global.scss'
import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
 return (
   <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp

//exibe toda nossa pagina de aplicação
//header, nav, footer tudo sera implementado aqui para que seja visualizado
//em toda nossa aplicação
//nesse caso o Header, o Player estão sempre presentes