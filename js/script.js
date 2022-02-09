getMensagens();
let msg = [];
function getMensagens(){
    const resposta = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    resposta.then(renderizarMensagem); 
}

function renderizarMensagem(mensagem){    
    msg = mensagem.data; 
    console.log(msg);   
    let conteudo = document.querySelector(".conteudo");
    for(let i = 0; i < msg.length; i++){
        conteudo.innerHTML += `    
        <div class="div-mensagens">
            <time>(${msg[i].time})</time>
            <strong>${msg[i].from}</strong>
            <span>para</span>            
            <strong>${msg[i].to}</strong>
            ${msg[i].text}
        </div>        
        `;
    }   
}

