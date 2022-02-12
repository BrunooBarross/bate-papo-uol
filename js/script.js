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
setInterval(getMensagens, 3000);
function getMensagens(){
    const resposta = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    resposta.then(renderizarMensagem); 
}
let ultimaDiv;   
function renderizarMensagem(mensagem){  
    let conteudo = document.querySelector(".conteudo");          
    msg = mensagem.data;          
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
let mensagem;
function enviarMensagem(){
    mensagem = document.querySelector(".entrada").value;    
    const promise = axios.post(
        "https://mock-api.driven.com.br/api/v4/uol/messages",
        {
            from: nomeUsuario,
            to: usuarioEscolhido,
            text: mensagem,
            type: "message" 
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
}
function quandoSucessoMensagem(){
    console.log('Mensagem enviada');
    mensagem = document.querySelector(".entrada").value='';
    getMensagens();
}

setInterval(getUsuarios, 30000);

function getUsuarios(){        
    const resposta = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    resposta.then(rendenrizarUsuarios);    
} 
let usuarios = [];
function rendenrizarUsuarios(usuario){  
    limpaUsuarios();
    usuarios.splice(0, usuarios.length);     
    let conteudo = document.querySelector(".escolher-usuario");          
    usuarios = usuario.data;
    conteudo.innerHTML += `
        <div class="todos" onclick="selecionarUsuario(this, 'todos')">
            <ion-icon name="people"></ion-icon>
            <p>Todos</p>
        </div>         
    `;              
    for(let i = 0; i < msg.length; i++){          
        conteudo.innerHTML += `           
            <div class="todos" onclick="selecionarUsuario(this, '${usuarios[i].name}')">
                <ion-icon name="people"></ion-icon>
                <p>${usuarios[i].name}</p>
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
let usuarioEscolhido = "todos";
function selecionarUsuario(div, usuario){
    usuarioEscolhido = usuario;
}
function abrirMenu(){
    document.querySelector(".menu-modal").style.display="block"
    document.querySelector(".sombra").style.display="block"
}
function fecharMenu(){
    document.querySelector(".menu-modal").style.display="none"
    document.querySelector(".sombra").style.display="none"
}