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
        if(msg[i].text === 'entra na sala...' || msg[i].text === 'sai da sala...'){
            conteudo.innerHTML += `    
                <div class="div-mensagens" id=${[i]}>
                <div class="time"><time>(${msg[i].time})</time></div>  
                    <strong>${msg[i].from}</strong>                                
                    ${msg[i].text}
                </div>        
            `;
            
            }else{
                conteudo.innerHTML += `    
                    <div class="div-entrada-saida" id=${[i]}>
                        <div class="time"><time>(${msg[i].time})</time></div>                        
                        <strong>${msg[i].from}</strong><span>para</span>
                                    
                        <strong>${msg[i].to}</strong>
                        ${msg[i].text}
                    </div>        
                `;
        }         
    }     
}

