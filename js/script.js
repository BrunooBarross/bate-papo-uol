let nomeUsuario;
solicitarUsuario();
function solicitarUsuario(){
    nomeUsuario = prompt('Qual é o seu nome de usuário');
    const promise = axios.post(
        "https://mock-api.driven.com.br/api/v4/uol/participants ",
        {
          name: nomeUsuario
        }
      );
      promise.then(quandoSucesso);
      promise.catch(quandoErro);    
}
function quandoErro(erro){
    if(erro.response.status === 400){
        nomeUsuario = prompt('Este usuário já existe, por favor escolha outro nome de usuário');
    }
}
function quandoSucesso(alerta){
    if(alerta.status === 200){
        console.log("logado com sucesso")
    }    
}

let msg = [];
getMensagens();
function getMensagens(){
    const resposta = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    resposta.then(renderizarMensagem); 
}

function renderizarMensagem(mensagem){    
    msg = mensagem.data; 
    console.log(msg);   
    let conteudo = document.querySelector(".conteudo");      
    for(let i = 0; i < msg.length; i++){
        if(msg[i].text === 'entra na sala...' || msg[i].text === 'sai da sala...'){
            conteudo.innerHTML += `    
                <div class="div-entrada-saida  " id=${[i]}>
                    <p><time>(${msg[i].time})</time> 
                    <strong>${msg[i].from}</strong>                                
                    ${msg[i].text}</p>                     
                </div>        
            `;
                     
            }else{
                conteudo.innerHTML += `    
                    <div class="div-mensagens" id=${[i]}>
                        <p><time>(${msg[i].time})</time>                       
                        <strong>${msg[i].from}</strong>
                        <span>para</span> sdf                                   
                        <strong>${msg[i].to}</strong>
                        ${msg[i].text}</p> 
                    </div>        
                `;
        }         
    }     
}
let mensagem;
function enviarMensagem(){
    mensagem = document.querySelector(".entrada").value;    
    const promise = axios.post(
        "https://mock-api.driven.com.br/api/v4/uol/messages",
        {
            from: nomeUsuario,
            to: "todos",
            text: mensagem,
            type: "message" 
        }
        );
        promise.then(quandoSucessoMensagem);
        promise.catch(quandoErroMensagem);  
     
}
function quandoErroMensagem(){
    console.log('Erro na mensagem');
}
function quandoSucessoMensagem(){
    console.log('Mensagem enviada');
    mensagem = document.querySelector(".entrada").value='';
}
