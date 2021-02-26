//obtendo informacoes de sessoes do formulario
mensagem = document.querySelector("#caixaDeMensagem");
form = document.querySelector("#form1");
btnCadastra = document.querySelector("#cadastrar");
tabelaLista = document.querySelector("#listaDeMensagens");

// importando dados do banco e alimentando area de mensagens salvas
//fetch('http://localhost:3000/lstmensagens')
fetch('/lstmensagens')
    .then(function (response) {
        return response.json()
    })
    .then(function (response) {
        //console.log(response);
        response.forEach(function (mensagem) {

            linhaTabela = '<tr>';
            linhaTabela += '<td class="colMensagem" >' + mensagem.mensagem + '</td>';
            linhaTabela += '<td><p></p><button onclick="Ouvir(this)">Ouvir</button><p></p></td>';
            linhaTabela += '</tr>';

            $("#listaDeMensagens tbody").prepend(linhaTabela);
        });
        //
    });
//


//sintetizando texto em mp3 
function Ouvir(elmnt) {
    //obtendo texto da mensagem para conversao
    tdobj = $(elmnt).closest('tr').find('td');
    textoLeitura = tdobj[0].innerHTML;

    // ================ criacao de arquivo sintetizado
    let ajax = new XMLHttpRequest();
    let params = '?textoLeitura=' + textoLeitura;

    ajax.open('GET', '/sintetizar' + params, false);
    ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    ajax.onreadystatechange = function () {

        if (ajax.status === 200 && ajax.readyState === 4) {
            console.log('acao concluida');
        }
    };

    ajax.send();

    reproduzirArquivo();


};


//
function reproduzirArquivo() {

    console.log('audio reproduzido...');

    var meuAudio = setTimeout(function () {
        var audio1 = document.createElement('audio');
        document.body.appendChild(audio1);
        audio1.src = '/audio';
        audio1.play();
    }, 2500)

}




//incluindo novas mensagens no banco e na area de mensagem
btnCadastra.addEventListener("click", function (event) {
    event.preventDefault();

    if (mensagem.value != "") {

        mensagemIncluir = mensagem.value;

        // montagem de linhas da tabela
        linhaTabela = '<tr>';
        linhaTabela += '<td class="colMensagem">' + mensagemIncluir + '</td>';
        linhaTabela += '<td><p></p><button onclick="Ouvir(this)">Ouvir</button><p></p></td>';
        linhaTabela += '</tr>';


        $("#listaDeMensagens tbody").prepend(linhaTabela);
        document.getElementById('caixaDeMensagem').value = "";

        //document.addEventListener("DOMContentLoaded", load, false);

        // ================ ajax
        let ajax = new XMLHttpRequest();
        let params = 'mensagem=' + mensagemIncluir;

        ajax.open('POST', 'http://localhost:3000/inseremensagem');
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = function () {
            //console.log('entrou na inseremensagem');
            if (ajax.status === 200 && ajax.readyState === 4) {
                console.log('Mensagem adicionada.');
                //console.log(ajax.responseText);
            }

        };

        ajax.send(params);

    }
})
