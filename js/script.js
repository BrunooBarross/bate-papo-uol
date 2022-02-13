let nomeUsuario;
solicitarUsuario();

function solicitarUsuario(){
    nomeUsuario = prompt('Qual é o seu nome de usuário');
    const promise = axios.post(
        "https://mock-api.driven.com.br/api/v4/uol/participants",
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
        getMensagens();
    }    
}

let msg = [];
let comparaMsg =[];
let novasMensagens=[];
setInterval(getMensagens, 3000);
function getMensagens(){
    const resposta = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    resposta.then(renderizarMensagem); 
}

function renderizarMensagem(mensagem){  
    let conteudo = document.querySelector(".conteudo");          
    msg = mensagem.data;   
    limpaMensagens()       
    for(let i = 0; i < msg.length; i++){
        if(msg[i].type === "status"){            
            conteudo.innerHTML += `    
                <div class="div-entrada-saida" id=${[i]}>
                    <p><time>(${msg[i].time})</time> 
                    <strong>${msg[i].from}</strong>                                
                    ${msg[i].text}</p>                     
                </div>        
            `;                      
            }else if(msg[i].type === "private_message"){
                conteudo.innerHTML += `    
                    <div class="div-reservado" id=${[i]}>
                        <p><time>(${msg[i].time})</time>                        
                        <strong>${msg[i].from}</strong> 
                        <span>reservadamente para</span>  
                        <strong>${msg[i].to}</strong>                               
                        ${msg[i].text}</p>                     
                    </div>        
                `;    
            }else{
                conteudo.innerHTML += `    
                    <div class="div-mensagens" id=${[i]}>
                        <p><time>(${msg[i].time})</time>                       
                        <strong>${msg[i].from}</strong>
                        <span>para</span>                                   
                        <strong>${msg[i].to}</strong>
                        ${msg[i].text}</p> 
                    </div>        
                `;
        }              
    }
    conteudo = conteudo.lastElementChild;    
    conteudo.scrollIntoView()  
}
function limpaMensagens(){
    let divMensagens = document.querySelector(".conteudo");
    while(divMensagens.firstChild){
        divMensagens.removeChild(divMensagens.firstChild);
    }   
}
document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {    
        let btn = document.querySelector(".envia-msg");      
        btn.click();    
    }
  });
let mensagem;
function enviarMensagem(){
    mensagem = document.querySelector(".entrada").value;    
    const promise = axios.post(
        "https://mock-api.driven.com.br/api/v4/uol/messages",
        {
            from: nomeUsuario,
            to: usuarioEscolhido,
            text: mensagem,
            type: tipoDeMensagem 
        }
        );
        promise.then(quandoSucessoMensagem);
        promise.catch(quandoErroMensagem);        
}


setInterval(statusUsuario, 5000);
function statusUsuario(){
    const promiseUser = axios.post(
        "https://mock-api.driven.com.br/api/v4/uol/status",
            {
             name: nomeUsuario
            }
        );
   ;  
}
function quandoErroMensagem(){
    console.log('Erro na mensagem');
    window.location.reload()
}
function quandoSucessoMensagem(){
    console.log('Mensagem enviada');
    mensagem = document.querySelector(".entrada").value='';
    getMensagens();
}

setInterval(getUsuarios, 10000);

function getUsuarios(){        
    const resposta = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    resposta.then(renderizarUsuarios);    
} 
let usuarios = [];
function renderizarUsuarios(usuario){  
    limpaUsuarios();
    usuarios.splice(0, usuarios.length);     
    let conteudo = document.querySelector(".escolher-usuario");          
    usuarios = usuario.data;
    conteudo.innerHTML += `
        <div class="todos" onclick="selecionarUsuario(this, 'todos')">
            <ion-icon class="icone-pessoa" name="people"></ion-icon>
            <p>Todos</p>
            <ion-icon class="check" name="checkmark-outline"></ion-icon>
        </div>         
    `;              
    for(let i = 0; i < msg.length; i++){          
        conteudo.innerHTML += `           
            <div class="todos" onclick="selecionarUsuario(this, '${usuarios[i].name}')">
                <ion-icon class="icone-pessoa" name="people"></ion-icon>
                <p>${usuarios[i].name}</p>
                <ion-icon class="check" name="checkmark-outline"></ion-icon>
            </div>   
        `;       
    }                                          
}
function limpaUsuarios(){
    let divUsuarios = document.querySelector(".escolher-usuario");
    while(divUsuarios.firstChild){
        divUsuarios.removeChild(divUsuarios.firstChild);
    }   
}
function abrirMenu(){
    document.querySelector(".menu-modal").style.display="block"
    document.querySelector(".sombra").style.display="block"
}
function fecharMenu(){
    document.querySelector(".menu-modal").style.display="none"
    document.querySelector(".sombra").style.display="none"
}
let usuarioEscolhido = "todos";
function selecionarUsuario(div, usuario){
    usuarioEscolhido = usuario;
    let usuarioSelecionado = document.querySelector(".ativa-check");
    if(usuarioSelecionado !== null){
        usuarioSelecionado.classList.remove("ativa-check")
    }    
    div.classList.add("ativa-check");    
}

let tipoDeMensagem = 'message';
function tipoMensagem(div, tipoMensagem){
    tipoDeMensagem = tipoMensagem;
    let tipoSelecionado = document.querySelector(".ativa-msg"); 
    if(tipoSelecionado !== null){
        tipoSelecionado.classList.remove("ativa-msg")
    }    
    div.classList.add("ativa-msg");    
}
function deslogarUsuario(){
    window.location.reload()
}