async function buscarPrecoFipeParaCard(card) {
    const marca = card.getAttribute("data-marca").toLowerCase();
    const modelo = card.getAttribute("data-modelo").toLowerCase();
    const spanPrecoFipe = card.querySelector(".preco-fipe");
  
    spanPrecoFipe.innerText = "Carregando...";
  
    try {
      const resMarcas = await fetch("https://parallelum.com.br/fipe/api/v1/carros/marcas");
      const marcas = await resMarcas.json();
      const marcaEncontrada = marcas.find(m => marca.includes(m.nome.toLowerCase()));
  
      if (!marcaEncontrada) {
        spanPrecoFipe.innerText = "Marca não encontrada";
        return;
      }
  
      const resModelos = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaEncontrada.codigo}/modelos`);
      const modelos = await resModelos.json();
      const modeloEncontrado = modelos.modelos.find(m => modelo.includes(m.nome.toLowerCase()));
  
      if (!modeloEncontrado) {
        spanPrecoFipe.innerText = "Modelo não encontrado";
        return;
      }
  
      const resAnos = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaEncontrada.codigo}/modelos/${modeloEncontrado.codigo}/anos`);
      const anos = await resAnos.json();
      const ano = anos.find(a => a.nome.includes("2023")) || anos[0];
  
      const resPreco = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaEncontrada.codigo}/modelos/${modeloEncontrado.codigo}/anos/${ano.codigo}`);
      const dados = await resPreco.json();
  
      spanPrecoFipe.innerText = dados.Valor || "Não disponível";
    } catch (erro) {
      console.error("Erro ao buscar FIPE:", erro);
      spanPrecoFipe.innerText = "Erro ao carregar";
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card[data-marca][data-modelo]");
    cards.forEach(card => buscarPrecoFipeParaCard(card));
  });
  