const inputMessage = document.getElementById("inputMessage");
const sendBtn = document.getElementById("sendBtn");
const chatbox = document.getElementById("chatbox");


function sendMessage(){
    

}



sendBtn.addEventListener("click" ,sendMessage)
inputMessage.addEventListener("keypress", function(e){
    if (e.key == "Enter") sendMessage();
})