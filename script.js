function cadastroAluno() {
    var nome = document.getElementById("nomeAluno").value;
    adicionarAlunoNaTabela(nome);
    document.getElementById("nomeAluno").value = ""; // Limpa o campo de input
    salvarTabela();
  }

  function adicionarAlunoNaTabela(nome) {
var tabela = document.getElementById("tabelaAlunos");
var linha = tabela.insertRow();
var celulaRanking = linha.insertCell();
celulaRanking.innerHTML = "";
var celulaNome = linha.insertCell();
var celulaAulas = linha.insertCell();
celulaAulas.innerHTML = "1";
var celulaAproveitamento = linha.insertCell();
celulaAproveitamento.innerHTML = "0%";
var celulaStatus = linha.insertCell();
celulaStatus.innerHTML = "<span class='status-inapto'>Inapto</span>";
var celulaAcoes = linha.insertCell();
celulaAcoes.innerHTML = "<span class='acao' onclick='adicionarAula(this)'><i class='bx bxs-upvote' ></i></i></span> " +
  "<span class='acao' onclick='subtrairAula(this)'><i class='bx bxs-downvote' ></i></span> " +
  "<span class='acao' onclick='excluirAluno(this)'><i class='bx bxs-trash'></i></span>";
}

  function adicionarAula(elemento) {
    var celulaAulas = elemento.parentNode.parentNode.cells[2];
    var quantidadeAulas = parseInt(celulaAulas.innerHTML);
    quantidadeAulas++;
    celulaAulas.innerHTML = quantidadeAulas;
    calcularAproveitamento(elemento.parentNode.parentNode);
    salvarTabela();
  }

  function subtrairAula(elemento) {
    var celulaAulas = elemento.parentNode.parentNode.cells[2];
    var quantidadeAulas = parseInt(celulaAulas.innerHTML);
    if (quantidadeAulas > 0) {
      quantidadeAulas--;
    }
    celulaAulas.innerHTML = quantidadeAulas;
    calcularAproveitamento(elemento.parentNode.parentNode);
    salvarTabela();
  }

  function calcularAproveitamento(aluno) {
    var celulaAulas = aluno.cells[2];
    var celulaAproveitamento = aluno.cells[3];
    var celulaStatus = aluno.cells[4]; // Célula para o status
    var quantidadeAulas = parseInt(celulaAulas.innerHTML);
    var aproveitamento = (quantidadeAulas / 45) * 100;
    celulaAproveitamento.innerHTML = aproveitamento.toFixed(2) + "%";

    if (aproveitamento < 50) {
      celulaAproveitamento.style.color = "#ff004a";
      celulaStatus.innerHTML = "<span class='status-inapto'>Inapto</span>";
    } else if (aproveitamento >= 50 && aproveitamento < 70) {
      celulaAproveitamento.style.color = "#01b4ff";
      celulaStatus.innerHTML = "<span class='status-em-analise'>Em análise</span>";
    } else {
      celulaAproveitamento.style.color = "#388e3c";
      celulaStatus.innerHTML = "<span class='status-apto'>Apto</span>";
    }

    if (aproveitamento === 100) {
      celulaAproveitamento.style.color = "#fff";
      celulaStatus.innerHTML = "<span class='status-apto'>Apto</span>";
    }
  }

  function excluirAluno(elemento) {
    var tabela = document.getElementById("tabelaAlunos");
    var linha = elemento.parentNode.parentNode;
    tabela.deleteRow(linha.rowIndex);
    salvarTabela();
  }

  function verificarTecla(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      cadastroAluno();
    }
  }

  function salvarTabela() {
    var tabela = document.getElementById("tabelaAlunos");
    var dados = [];

    for (var i = 1; i < tabela.rows.length; i++) {
      var aluno = tabela.rows[i];
      var nome = aluno.cells[1].innerHTML;
      var aulas = aluno.cells[2].innerHTML;
      dados.push({ nome: nome, aulas: aulas });
    }

    localStorage.setItem("tabelaAlunos", JSON.stringify(dados));
    atualizarRanking();
  }

  function carregarTabela() {
    var dados = localStorage.getItem("tabelaAlunos");

    if (dados) {
      dados = JSON.parse(dados);
      var tabela = document.getElementById("tabelaAlunos");

      for (var i = 0; i < dados.length; i++) {
        var aluno = dados[i];
        adicionarAlunoNaTabela(aluno.nome);
        var celulaAulas = tabela.rows[i + 1].cells[2];
        celulaAulas.innerHTML = aluno.aulas;
        calcularAproveitamento(tabela.rows[i + 1]);
      }
    }
    atualizarRanking();
  }

  function atualizarRanking() {
    var tabela = document.getElementById("tabelaAlunos");
    var linhas = Array.from(tabela.rows);
    linhas.shift(); // Remover o cabeçalho

    // Ordenar as linhas por ordem decrescente baseado no número de aulas
    linhas.sort(function (a, b) {
      var aulasA = parseInt(a.cells[2].innerHTML);
      var aulasB = parseInt(b.cells[2].innerHTML);
      return aulasB - aulasA;
    });

    // Atualizar o ranking na coluna correspondente
    for (var i = 0; i < linhas.length; i++) {
      var celulaRanking = linhas[i].cells[0];
      celulaRanking.innerHTML = (i + 1) + "º";
    }
  }

  function atualizarTabela() {
    var tabela = document.getElementById("tabelaAlunos");
    var linhas = Array.from(tabela.rows);
    linhas.shift(); // Remover o cabeçalho

    // Ordenar as linhas por ordem decrescente baseado no número de aulas
    linhas.sort(function (a, b) {
      var aulasA = parseInt(a.cells[2].innerHTML);
      var aulasB = parseInt(b.cells[2].innerHTML);
      return aulasB - aulasA;
    });

    // Remover todas as linhas da tabela
    while (tabela.rows.length > 1) {
      tabela.deleteRow(1);
    }

    // Adicionar as linhas ordenadas de volta à tabela
    for (var i = 0; i < linhas.length; i++) {
      tabela.appendChild(linhas[i]);
    }

    atualizarRanking();
    salvarTabela();
  }

  carregarTabela();