# noticias.py
# Descarga noticias de WoW Forever desde feeds RSS y las guarda en data/noticias.json
# Solo usa librerías que vienen con Python (no hay que instalar nada).

import json
import os
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

# Fuentes de noticias (feeds RSS). Puedes añadir más a esta lista.
FUENTES = [
    {"nombre": "Wowhead", "url": "https://www.wowhead.com/news/rss/all"},
]

# Solo guardamos noticias que contengan alguna de estas palabras
PALABRAS = ["forever"]

# Cuántas noticias guardamos como máximo
MAXIMO = 20

# Ruta del archivo de salida (relativa a la carpeta del proyecto)
CARPETA = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(CARPETA, "data", "noticias.json")


def descargar(url):
    """Descarga una URL y devuelve el contenido en bytes."""
    peticion = urllib.request.Request(url, headers={"User-Agent": "BrujulaDeAzeroth/1.0"})
    with urllib.request.urlopen(peticion, timeout=20) as respuesta:
        return respuesta.read()


def leer_feed(fuente):
    """Lee un feed RSS y devuelve una lista de noticias."""
    contenido = descargar(fuente["url"])
    raiz = ET.fromstring(contenido)
    noticias = []

    for item in raiz.iter("item"):
        titulo = item.findtext("title", "").strip()
        enlace = item.findtext("link", "").strip()
        fecha_texto = item.findtext("pubDate", "").strip()
        descripcion = item.findtext("description", "")

        # Filtramos: solo noticias que hablen de Forever
        texto = (titulo + " " + descripcion).lower()
        if not any(palabra in texto for palabra in PALABRAS):
            continue

        # Pasamos la fecha a formato ISO (2026-11-05T00:00:00+00:00)
        try:
            fecha = parsedate_to_datetime(fecha_texto).isoformat()
        except (TypeError, ValueError):
            fecha = ""

        noticias.append({
            "titulo": titulo,
            "enlace": enlace,
            "fecha": fecha,
            "fuente": fuente["nombre"],
        })

    return noticias


def main():
    todas = []
    errores = 0

    for fuente in FUENTES:
        try:
            noticias = leer_feed(fuente)
            print(f"{fuente['nombre']}: {len(noticias)} noticias de Forever")
            todas.extend(noticias)
        except Exception as error:
            errores += 1
            print(f"ERROR con {fuente['nombre']}: {error}")

    # Si han fallado todas las fuentes, no tocamos el archivo para no dejar la web vacía
    if errores == len(FUENTES):
        print("No se pudo leer ninguna fuente. No se actualiza el archivo.")
        return

    # Quitamos repetidas (mismo enlace) y ordenamos de más nueva a más antigua
    unicas = {}
    for noticia in todas:
        unicas[noticia["enlace"]] = noticia
    lista = sorted(unicas.values(), key=lambda n: n["fecha"], reverse=True)[:MAXIMO]

    os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
    with open(SALIDA, "w", encoding="utf-8") as archivo:
        json.dump(lista, archivo, ensure_ascii=False, indent=2)

    print(f"Guardadas {len(lista)} noticias en {SALIDA}")


if __name__ == "__main__":
    main()
