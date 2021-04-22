import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';
import Image from 'next/image';

type Episode = {
    id: string,
    title: string,
    thumbnail: string,
    members: string
    duration: string
    durationAsString: string,
    url: string,
    description: string,
    publishedAt: string,
}

type EpisodeProps = {
    episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
    const router = useRouter()
    //aqui é caso a pagina vai ser carregada pois nao foi gerada estaticamente, seria gerado na hora
    if (router.isFallback) {
        return <h1>Carregando ... </h1>
    }

    return (
        <div className={styles.episode} >
            <div className={styles.thumbnailContainer} >
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button" >
                    <img src="/play.svg" alt="Tocar Episodio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })


    const paths = data.map(episode => {
        console.log(episode.id)
        return {
            params: {
                slug: episode.id
            }
        }
    })



    return {
        paths, // vai gerar os 2 ultimos eposidios estaticamente
        // paths: [{
        //     params: {
        //         slug: 'a-importancia-da-contribuicao-em-open-source' // gera estaticamente dinamicamente uma pagina ao gerar a build do projeto
        /////////// vai gerar apenas esse episodio estaticamente,
        //     }
        // }],
        fallback: 'blocking' // incremental static regeneration
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => { // ctx = contexto
    const { slug } = ctx.params // slug é o mesmo nome do arquivo que a gente fez la no pages/episodes/[slug] se mudar o nome tem que mudar aqui

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        description: data.description,
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        url: data.file.url,
    }

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24, // 24 hours
    }
}