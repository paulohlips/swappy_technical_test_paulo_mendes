import type { JokeType } from "../services/api"
import { SensitiveChoice } from "./SensitiveContentChoice"

export const Joke = ({ data }: { data: JokeType }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '50vw',
            margin: '0 auto',
            textAlign: 'left',
            padding: '20px',
            border: '1px solid #fff',
            borderRadius: '10px',
            backgroundColor: '#101725',
            gap: '10px',
        }}>
            <img style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
            }} src={data.icon_url}
                alt="Joke Icon"
            />

            <SensitiveChoice>
                <p key={data.id} >{data.value}</p>
            </SensitiveChoice>
        </div>
    )
}