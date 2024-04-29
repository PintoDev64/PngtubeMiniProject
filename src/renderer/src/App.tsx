import { useState } from "react";
import { ActionAPI } from "./utils";

import PngtubeIcon from './assets/pngtubestudiologo.png'

export default function App() {

  const { LoadImage, CreateModel } = ActionAPI();

  const [Name, setName] = useState("")
  const [Avatars, setAvatars] = useState<[null | string, null | string]>([null, null]);

  function HandleCreateModel() {
    if (Name.length === 0) return
    if (Avatars[0] === null) return
    if (Avatars[1] === null) return

    CreateModel(Name, Avatars);
  }

  return (
    <>
      <header>
        <img src={PngtubeIcon} alt="PngtubeIcon" height={50} width={50} />
        <h1>Crea tu modelo Pngtube</h1>
      </header>
      <main id="PreviewAvatar">
        <div id="PreviewAvatarContent">
          <div className="PreviewAvatarContent-Image"
            onClick={() => setAvatars([LoadImage(0, Avatars[0]), Avatars[1]])}>
            {
              Avatars[0] !== null
                ? <img src={Avatars[0]} />
                : <p className="PreviewAvatarContent-PlaceHolder">Cargar primer estado</p>
            }
          </div>
          <div className="PreviewAvatarContent-Image"
            onClick={() => setAvatars([Avatars[0], LoadImage(1, Avatars[1])])}>
            {
              Avatars[1] !== null
                ? <img src={Avatars[1]} />
                : <p className="PreviewAvatarContent-PlaceHolder">Cargar Segundo estado</p>
            }
          </div>
        </div>
      </main>
      <footer>
        <div id="CreateModelAditional">
          <p id="CreateModelNameElement">Nombre</p>
          <input value={Name} type="text" id="CreateModelName" onChange={e => setName(e.target.value)} />
        </div>
        <button id="CreateModelButton" onClick={HandleCreateModel}>
          Generar Modelo
        </button>
      </footer>
    </>
  )
}


