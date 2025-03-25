from shaclc import shaclc_to_graph

read_path = 'shapes/serviceMunicipality.shaclc'
write_path = 'shapes/serviceMunicipality.shacl'
with open(read_path, 'r') as read_file:
    content = read_file.read()
    graph = shaclc_to_graph(content)
    with open(write_path, 'w') as write_file:
        write_file.write(graph.serialize(format="longturtle"))
