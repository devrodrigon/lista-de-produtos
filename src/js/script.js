const ul = document.querySelector('.produtos');
const botaoFiltrarPorCategorias = document.querySelectorAll('.secao');
const botaoBuscaPorNome = document.querySelector('.botaoBuscaPorNome');

const itemsCarrinho = [];

/******** Eventos ********/
botaoBuscaPorNome.addEventListener('click', buscarPorNome);
botaoFiltrarPorCategorias.forEach((secao) => secao.addEventListener('click', buscarPorSecao));

/****** Funções *******/
function buscarPorNome() {
  const { value: inputBusca } = document.querySelector('.campoBuscaPorNome');
  const stringInputBusca = normalize(inputBusca);

  const produto = produtos.filter((produto) => {
    const nome = normalize(produto.nome);
    const secao = normalize(produto.secao);
    const categoria = normalize(produto.categoria);

    return (
      nome.includes(stringInputBusca) ||
      secao.includes(stringInputBusca) ||
      categoria.includes(stringInputBusca)
    );
  });

  montarListaProdutos(produto);
}

function mostrarTodosItems() {
  montarListaProdutos(produtos);
}

function toggleActive(elemento) {
  botaoFiltrarPorCategorias.forEach((categoria) => categoria.classList.remove('ativo'));
  elemento.classList.add('ativo');
}

function buscarPorSecao(event) {
  const currentTarget = event.currentTarget;
  toggleActive(currentTarget);

  const secaoNome = currentTarget.innerText;

  if (secaoNome === 'Todos Produtos') {
    mostrarTodosItems();
  } else {
    const listaProdutos = produtos.filter((produto) => produto.secao === secaoNome);

    montarListaProdutos(listaProdutos);
  }
}

function criarListaOrdenada(componentes) {
  const ol = document.createElement('ol');
  ol.classList.add('nutrientes');
  componentes.forEach((componente) => {
    const li = document.createElement('li');
    li.classList.add('nutriente');
    li.innerText = componente;
    ol.appendChild(li);
  });

  return ol;
}

function montarListaProdutos(listaProdutos) {
  ul.innerHTML = '';
  listaProdutos.forEach((produto) => {
    const li = document.createElement('li');
    li.classList.add('produto');
    li.id = produto.id;

    const img = document.createElement('img');
    img.src = produto.img;
    img.alt = produto.nome;
    img.classList.add('produtoImg');

    const h3 = document.createElement('h3');
    h3.innerText = produto.nome;
    h3.classList.add('produtoNome');

    const p = document.createElement('p');
    p.innerText = produto.secao;
    p.classList.add('produtoSecao');

    const ol = criarListaOrdenada(produto.componentes);

    const div = document.createElement('div');

    const span = document.createElement('span');
    span.innerText = converterReal(produto.preco);
    span.classList.add('produtoPreco');

    const button = document.createElement('button');
    button.type = 'Button';
    button.innerText = 'Comprar';
    button.classList.add('botaoComprar');

    div.appendChild(span);
    div.appendChild(button);

    // Adicionando o elementos para o li
    li.appendChild(img);
    li.appendChild(h3);
    li.appendChild(p);
    li.appendChild(ol);
    li.appendChild(div);

    li.addEventListener('click', adicionarCarrinho);
    // Adicionando li ao HTML
    ul.appendChild(li);
  });

  if (!listaProdutos.length) {
    const mensagemItemNaoEncontrado = document.createElement('p');
    mensagemItemNaoEncontrado.innerText =
      'Oops! Não encontramos nenhum resultado para a sua busca.';

    ul.append(mensagemItemNaoEncontrado);
  }
}

montarListaProdutos(produtos);

/**** Funcionalidades carrinho ****/

function criarCarrinho({ img, nome, secao, preco }) {
  const li = document.createElement('li');
  li.classList.add('carrinhoProduto');

  const image = document.createElement('img');
  image.src = img;
  image.alt = nome;
  image.classList.add('carrinhoImg');

  const div = document.createElement('div');
  div.classList.add('infoItemCarrinho');

  const h2 = document.createElement('h2');
  h2.innerText = nome;
  h2.classList.add('carrinhoNome');

  const p = document.createElement('p');
  p.innerText = secao;
  p.classList.add('carrinhoSecao');

  const span = document.createElement('span');
  span.innerText = converterReal(preco);
  span.classList.add('carrinhoPreco');

  const trashImg = document.createElement('img');
  trashImg.src = './src/img/trash.svg';
  trashImg.alt = 'excluir produto';
  trashImg.classList.add('excluirProduto');

  div.appendChild(h2);
  div.appendChild(p);
  div.appendChild(span);

  li.appendChild(image);
  li.appendChild(div);
  li.appendChild(trashImg);

  return li;
}

function atualizarInfoCarrinho() {
  const quantidade = itemsCarrinho.length;
  const total = itemsCarrinho.reduce((total, valor) => total + Number(valor.preco), 0);

  document.querySelector('.quantidadeCarrinho').innerText = quantidade;
  document.querySelector('.totalCarrinho').innerText = converterReal(total);
}

function adicionarCarrinho(event) {
  const listaCarrinho = document.querySelector('.listaCarrinho');

  if (event.target.classList.contains('botaoComprar')) {
    const id = event.currentTarget.id;

    const produto = produtos.find((produto) => produto.id === Number(id));
    itemsCarrinho.push(produto);

    const produtoCarrinho = criarCarrinho(produto);
    produtoCarrinho.addEventListener('click', removerCarrinho);

    listaCarrinho.appendChild(produtoCarrinho);

    atualizarInfoCarrinho();

    document.querySelector('.carrinho-sem-item').style.display = 'none';
    document.querySelector('.carrinho-com-item').style.display = 'block';
    document.querySelector('.infoCarrinho').style.display = 'flex';
  }
}

function removerCarrinho(event) {
  const produtosCarrinho = document.querySelectorAll('.carrinhoProduto');
  if (event.target.classList.contains('excluirProduto')) {
    const produto = event.currentTarget;
    const indexItemExcluido = Object.values(produtosCarrinho).findIndex(
      (produto) => produto === event.currentTarget
    );

    itemsCarrinho.splice(indexItemExcluido, 1);
    produto.remove();

    atualizarInfoCarrinho();

    if (!itemsCarrinho.length) {
      document.querySelector('.carrinho-sem-item').style.display = 'flex';
      document.querySelector('.carrinho-com-item').style.display = 'none';
      document.querySelector('.infoCarrinho').style.display = 'none';
    }
  }
}

/***** Funções úteis ******/

function converterReal(valor) {
  const valorFormatado = Number(valor);
  return valorFormatado.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
}

function normalize(string) {
  return string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
