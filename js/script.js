let nomeUsuario;
let ultimaMensagem = '';
let comparadorMensagem = false;
let indexInicial = 0;

document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {    
        let btn = document.querySelector(".envia-usuario");      
        btn.click();    
    }
});
function solicitarUsuario(){
    //nomeUsuario = prompt('Qual é o seu nome de usuário');
    error.innerHTML = '';
    nomeUsuario = document.querySelector(".input-usuario").value;
    const promise = axios.post(
        "https://mock-api.driven.com.br/api/v4/uol/participants",
        {
          name: nomeUsuario
        }
      );
      promise.then(quandoSucesso);
      promise.catch(quandoErro);    
}
let error = document.querySelector(".msg-erro");
function quandoErro(erro){
    if(erro.response.status === 400){
        error.innerHTML += `<p>O nome: <span>${nomeUsuario}</span> não esta disponível<p>`;         
        document.querySelector(".input-usuario").value='';     
    }
}
function quandoSucesso(alerta){
    document.querySelector(".container-modal").style.display = "none";
    let btn = document.querySelector(".envia-usuario");  
    btn.setAttribute("onClick","");
    if(alerta.status === 200){
        getMensagens();
        getUsuarios();
        enviarComEnter();
        statusUsuario();
        setInterval(getMensagens, 3000);
        setInterval(statusUsuario, 5000);
        setInterval(getUsuarios, 5000);
    }    
}

let msg = [];
let comparaMsg =[];
let novasMensagens=[];

function getMensagens(){
    const resposta = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    resposta.then(renderizarMensagem); 
}

function renderizarMensagem(mensagem){  
    let conteudo = document.querySelector(".conteudo");          
    msg = mensagem.data;   
    //limpaMensagens()  
    for(let i = 0; i < msg.length; i++){  
        if (comparadorMensagem == true){
            for (let i = msg.length-1; i>=0 ; i--) {            
               if (ultimaMensagem === msg[i].from + msg[i].text + msg[i].time){
                    indexInicial = i+1;               
                } 
            }   
        }
    }    
    for(let i = indexInicial; i < msg.length; i++){
        if(msg[i].type === "status"){            
            conteudo.innerHTML += `    
                <div class="div-entrada-saida" id=${[i]}>
                    <div class="texto">
                        <p><time>(${msg[i].time})</time> 
                        <strong>${msg[i].from}</strong>                                
                        ${msg[i].text}</p>  
                    <div>                    
                </div>        
            `;                      
            }else if(msg[i].type === "private_message"){
                conteudo.innerHTML += `    
                    <div class="div-reservado" id=${[i]}>
                        <div class="texto">
                            <p><time>(${msg[i].time})</time>                        
                            <strong>${msg[i].from}</strong> 
                            <span>reservadamente para</span>  
                            <strong>${msg[i].to}</strong>                               
                            ${msg[i].text}</p>            
                        <div>                                 
                    </div>        
                `;    
            }else{
                conteudo.innerHTML += `    
                    <div class="div-mensagens" id=${[i]}>
                        <div class="texto">
                            <p><time>(${msg[i].time})</time>                       
                            <strong>${msg[i].from}</strong>
                            <span>para</span>                                   
                            <strong>${msg[i].to}</strong>
                            ${msg[i].text}</p> 
                        <div>    
                    </div>        
                `;
        }              
    }
    ultimaMensagem = msg[99].from + msg[99].text + msg[99].time;
    comparadorMensagem = true;
    conteudo = conteudo.lastElementChild;    
    conteudo.scrollIntoView()  
}
//function limpaMensagens(){
//    let divMensagens = document.querySelector(".conteudo");
//   while(divMensagens.firstChild){
//        divMensagens.removeChild(divMensagens.firstChild);
//    }   
//}
function enviarComEnter(){
    document.addEventListener("keypress", function(e) {
        if(e.key === 'Enter') {    
            let btn = document.querySelector(".envia-msg");      
            btn.click();    
        }
    });
}
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
function statusUsuario(){
    const promiseUser = axios.post(
        "https://mock-api.driven.com.br/api/v4/uol/status",
            {
             name: nomeUsuario
            }
        );
   ;  
}

function quandoSucessoMensagem(){
    //console.log('Mensagem enviada');
    mensagem = document.querySelector(".entrada").value='';
    getMensagens();
}

function quandoErroMensagem(){
    console.log('Erro na mensagem');
    window.location.reload()
}
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
let paraQuem = document.querySelector(".paraQuem");
paraQuem.innerHTML = "Enviar para todos (publicamente)";
function selecionarUsuario(div, usuario){    
    usuarioEscolhido = usuario;   
    paraQuem.innerHTML = "Enviar para " + usuarioEscolhido+" "+converteTipoMensagem;
    let usuarioSelecionado = document.querySelector(".ativa-check");
    if(usuarioSelecionado !== null){
        usuarioSelecionado.classList.remove("ativa-check")
    }    
    div.classList.add("ativa-check");    
}

let tipoDeMensagem = 'message';
let converteTipoMensagem = '(publicamente)'
function tipoMensagem(div, tipoMensagem){
    tipoDeMensagem = tipoMensagem;
    if(tipoDeMensagem == 'message'){
        converteTipoMensagem = '(publicamente)'        
    }else{
        converteTipoMensagem = '(reservadamente)'
    }
    paraQuem.innerHTML = "Enviar para " + usuarioEscolhido+" "+converteTipoMensagem;
    let tipoSelecionado = document.querySelector(".ativa-msg"); 
    if(tipoSelecionado !== null){
        tipoSelecionado.classList.remove("ativa-msg")
    }    
    div.classList.add("ativa-msg");    
}
function deslogarUsuario(){
    window.location.reload()
}