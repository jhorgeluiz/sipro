const horarioInicio = "18:00";

const horarioFim = document.getElementById("horarioFim");

const listaHoras = document.getElementById("listaHoras");

const totalHoje = document.getElementById("totalHoje");

const dataAtual = document.getElementById("dataAtual");


/*
==========================================================
DATA ATUAL
==========================================================
*/

function obterDataHoje() {

    const hoje = new Date();

    return hoje.toLocaleDateString("pt-BR");

}

dataAtual.textContent = obterDataHoje();


/*
==========================================================
REGISTRAR HORA EXTRA
==========================================================
*/

function registrarHoraExtra() {

    const fim = horarioFim.value;


    if (!fim) {

        alert("Informe o horário de término.");

        return;

    }


    const inicioMinutos = converterParaMinutos(horarioInicio);

    const fimMinutos = converterParaMinutos(fim);


    if (fimMinutos <= inicioMinutos) {

        alert(
            "O horário de término deve ser maior que 18:00."
        );

        return;

    }


    const diferenca = fimMinutos - inicioMinutos;


    const registro = {

        id: Date.now(),

        data: obterDataHoje(),

        inicio: horarioInicio,

        fim: fim,

        minutos: diferenca

    };


    salvarRegistro(registro);


    horarioFim.value = "";


    carregarHistorico();

}


/*
==========================================================
CONVERTER HORA PARA MINUTOS
==========================================================
*/

function converterParaMinutos(hora) {

    const partes = hora.split(":");

    const horas = parseInt(partes[0]);

    const minutos = parseInt(partes[1]);


    return (horas * 60) + minutos;

}


/*
==========================================================
FORMATAR MINUTOS
==========================================================
*/

function formatarTempo(minutosTotal) {

    const horas = Math.floor(minutosTotal / 60);

    const minutos = minutosTotal % 60;


    const horasFormatadas =
        String(horas).padStart(2, "0");

    const minutosFormatados =
        String(minutos).padStart(2, "0");


    return horasFormatadas + ":" + minutosFormatados;

}


/*
==========================================================
SALVAR NO LOCALSTORAGE
==========================================================
*/

function salvarRegistro(registro) {

    const registros = obterRegistros();

    registros.push(registro);


    localStorage.setItem(

        "horas_extras",

        JSON.stringify(registros)

    );

}


/*
==========================================================
OBTER REGISTROS
==========================================================
*/

function obterRegistros() {

    const dados = localStorage.getItem(
        "horas_extras"
    );


    if (!dados) {

        return [];

    }


    return JSON.parse(dados);

}


/*
==========================================================
CARREGAR HISTÓRICO
==========================================================
*/

function carregarHistorico() {

    const registros = obterRegistros();


    listaHoras.innerHTML = "";


    let minutosHoje = 0;


    const hoje = obterDataHoje();


    registros
        .sort((a, b) => b.id - a.id)
        .forEach(function(registro) {


            if (registro.data === hoje) {

                minutosHoje += registro.minutos;

            }


            const tr = document.createElement("tr");


            tr.innerHTML = `

                <td>${registro.data}</td>

                <td>${registro.inicio}</td>

                <td>${registro.fim}</td>

                <td>
                    ${formatarTempo(registro.minutos)}
                </td>

                <td>

                    <button
                        class="btn-excluir"
                        onclick="excluirRegistro(${registro.id})"
                    >
                        Excluir
                    </button>

                </td>

            `;


            listaHoras.appendChild(tr);

        });


    totalHoje.textContent =
        formatarTempo(minutosHoje);

}


/*
==========================================================
EXCLUIR REGISTRO
==========================================================
*/

function excluirRegistro(id) {

    let registros = obterRegistros();


    registros = registros.filter(function(registro) {

        return registro.id !== id;

    });


    localStorage.setItem(

        "horas_extras",

        JSON.stringify(registros)

    );


    carregarHistorico();

}


/*
==========================================================
LIMPAR HISTÓRICO
==========================================================
*/

function limparHistorico() {

    const confirmar = confirm(
        "Deseja realmente apagar todo o histórico?"
    );


    if (!confirmar) {

        return;

    }


    localStorage.removeItem(
        "horas_extras"
    );


    carregarHistorico();

}


/*
==========================================================
INICIAR
==========================================================
*/

carregarHistorico();