import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLoading,
  IonText,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonLabel,
  IonChip,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/react";

import { useEffect, useState } from "react";
import axios from "axios";

import "./Home.css"; // 👈 Importamos estilos personalizados

/* ---------------------------------------------
   INTERFAZ TYPESCRIPT
--------------------------------------------- */
interface Personaje {
  id: number;
  name: string;
  gender: string;
  status: string;
  species: string;
  image: string;
}

/* ---------------------------------------------
   COMPONENTE HOME
--------------------------------------------- */
const Home: React.FC = () => {

  // Lista de personajes
  const [personajes, setPersonajes] = useState<Personaje[]>([]);

  // Estado de carga
  const [cargando, setCargando] = useState<boolean>(true);

  // Estado de error
  const [error, setError] = useState<string>("");

  /* ---------------------------------------------
     FUNCIÓN PARA CARGAR PERSONAJES DESDE API
  --------------------------------------------- */
  const cargarPersonajes = async () => {
    try {
      setCargando(true);

      const url =
        "https://futuramaapi.com/api/characters?orderBy=id&orderByDirection=asc&page=1&size=50";

      const respuesta = await axios.get(url);

      setPersonajes(respuesta.data.items);

      setError("");
    } catch (err) {
      setError("❌ Error al cargar los personajes. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  /* ---------------------------------------------
     CARGA AUTOMÁTICA AL INICIAR
  --------------------------------------------- */
  useEffect(() => {
    cargarPersonajes();
  }, []);

  /* ---------------------------------------------
     FUNCIÓN PARA COLORES DE CHIPS
  --------------------------------------------- */
  const colorGenero = (genero: string) => {
    if (genero === "MALE") return "primary";
    if (genero === "FEMALE") return "danger";
    return "medium";
  };

  const colorEstado = (estado: string) => {
    if (estado === "ALIVE") return "success";
    if (estado === "DEAD") return "dark";
    return "warning";
  };

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
  return (
    <IonPage>

      {/* ENCABEZADO */}
      <IonHeader>
        <IonToolbar>
          <IonTitle className="titulo-verde">
            Personajes de Futurama
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* CONTENIDO */}
      <IonContent className="ion-padding">

        {/* CARGA */}
        <IonLoading
          isOpen={cargando}
          message="Cargando personajes..."
        />

        {/* ERROR */}
        {error && (
          <IonText color="danger">
            <h2>{error}</h2>
          </IonText>
        )}

        {/* VACÍO */}
        {!cargando && personajes.length === 0 && !error && (
          <IonText color="medium">
            <h2>No se encontraron personajes disponibles.</h2>
          </IonText>
        )}

        {/* LISTA CON GRID */}
        {!cargando && personajes.length > 0 && (
          <IonGrid>
            <IonRow>
              {personajes.map((personaje) => (
                <IonCol size="12" sizeMd="6" sizeLg="4" key={personaje.id}>
                  
                  <IonCard className="tarjeta-personaje">
                    <IonCardContent>

                      {/* IMAGEN + NOMBRE */}
                      <div className="fila-personaje">

                        <IonAvatar>
                          <img
                            src={personaje.image}
                            alt={personaje.name}
                          />
                        </IonAvatar>

                        <IonLabel className="info-personaje">
                          <h2>{personaje.name}</h2>

                          {/* CHIPS */}
                          <IonChip color={colorGenero(personaje.gender)}>
                            Género: {personaje.gender}
                          </IonChip>

                          <IonChip color={colorEstado(personaje.status)}>
                            Estado: {personaje.status}
                          </IonChip>
                        </IonLabel>
                      </div>

                    </IonCardContent>
                  </IonCard>

                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Home;
