from search import create_index, get_municipalities

INDEX_DIR = ".whoosh"
INDEX_NAME = "municipalities"


def build():
    index = create_index()
    writer = index.writer()
    for municipality in get_municipalities():
        writer.add_document(url=str(municipality.url),
                            name=str(municipality.name.encode("utf-8")),
                            id=int(municipality.id),
                            lat=float(municipality.lat),
                            long=float(municipality.long))
    writer.commit()


if __name__ == "__main__":
    build()
