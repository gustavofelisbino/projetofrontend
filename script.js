const formHabito = document.getElementById("form-habito");
const inputHabito = document.getElementById("input-habito");
const listaHabitos = document.getElementById("habitos-ul");
const habitosCompletos = document.getElementById("habitos-completos");
const habitosTotais = document.getElementById("habitos-totais");
const barraProgresso = document.getElementById("barra-progresso");
const btnReiniciarDia = document.getElementById("reiniciar-dia");
const btnLimparTudo = document.getElementById("limpar-tudo");
const acoesLista = document.getElementById("acoes-lista");

let habitos = [];

formHabito.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = inputHabito.value.trim();
    if (texto !== "") {
        habitos.push({ texto, completo: false });
        inputHabito.value = "";
        renderizarHabitos();
    }
});

function renderizarHabitos() {
    listaHabitos.innerHTML = "";
    habitos.forEach((habito, index) => {
        const li = document.createElement("li");
        li.className = habito.completo ? "completed" : "";

        const divTexto = document.createElement("div");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = habito.completo;
        checkbox.addEventListener("change", () => {
            habito.completo = checkbox.checked;
            renderizarHabitos();
        });

        const span = document.createElement("span");
        span.textContent = habito.texto;

        divTexto.appendChild(checkbox);
        divTexto.appendChild(span);

        const divBotoes = document.createElement("div");

        const btnEditar = document.createElement("button");
        btnEditar.className = "edit-button";
        btnEditar.innerHTML = 'Editar';
        btnEditar.addEventListener("click", () => editarHabito(index));

        const btnRemover = document.createElement("button");
        btnRemover.className = "remove-button";
        btnRemover.innerHTML = 'Remover';
        btnRemover.addEventListener("click", () => removerHabito(index, li));

        divBotoes.appendChild(btnEditar);
        divBotoes.appendChild(btnRemover);

        li.appendChild(divTexto);
        li.appendChild(divBotoes);
        listaHabitos.appendChild(li);
    });

    atualizarProgresso();
    acoesLista.style.display = habitos.length > 0 ? "flex" : "none";
}

function editarHabito(index) {
    const novoTexto = prompt("Editar hábito:", habitos[index].texto);
    if (novoTexto !== null) {
        habitos[index].texto = novoTexto.trim();
        renderizarHabitos();
    }
}

function removerHabito(index, elemento) {
    elemento.classList.add("removing");
    setTimeout(() => {
        habitos.splice(index, 1);
        renderizarHabitos();
    }, 400);
}

function atualizarProgresso() {
    const total = habitos.length;
    const completos = habitos.filter(h => h.completo).length;
    const porcentagem = total > 0 ? (completos / total) * 100 : 0;

    habitosTotais.textContent = total;
    habitosCompletos.textContent = completos;
    barraProgresso.value = porcentagem;
}

btnReiniciarDia.addEventListener("click", () => {
    habitos.forEach(h => h.completo = false);
    renderizarHabitos();
});

btnLimparTudo.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja apagar todos os hábitos?")) {
        habitos = [];
        renderizarHabitos();
    }
});

renderizarHabitos();

let diasSalvos = JSON.parse(localStorage.getItem("diasSalvos")) || {};

document.getElementById("btn-salvar-dia").addEventListener("click", salvarDiaAtual);

document.addEventListener("DOMContentLoaded", atualizarDiasSalvos);

function salvarDiaAtual() {
    const hoje = new Date().toISOString().split("T")[0];
    diasSalvos[hoje] = habitos.map(h => ({ ...h }));
    localStorage.setItem("diasSalvos", JSON.stringify(diasSalvos));
    atualizarDiasSalvos();
    alert(`Dia ${hoje} salvo com sucesso!`);
}

function atualizarDiasSalvos() {
    const listaDias = document.getElementById("dias-salvos-lista");
    if (!listaDias) return;
    listaDias.innerHTML = "";

    const datas = Object.keys(diasSalvos).sort().reverse();
    datas.forEach(data => {
        const li = document.createElement("li");
        li.textContent = formatarData(data);
        li.addEventListener("click", () => exibirHabitosDoDia(data));
        listaDias.appendChild(li);
    });
}

function exibirHabitosDoDia(data) {
    document.getElementById("data-selecionada").textContent = formatarData(data);
    const lista = document.getElementById("habitos-salvos-do-dia");
    lista.innerHTML = "";

    diasSalvos[data].forEach(h => {
        const li = document.createElement("li");
        li.textContent = `${h.texto} - ${h.completo ? "✔️" : "❌"}`;
        lista.appendChild(li);
    });

    lista.style.display = "block";
}

function formatarData(data) {
    const partes = data.split("-");
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

document.getElementById("habitos-salvos-do-dia").style.display = "none";
