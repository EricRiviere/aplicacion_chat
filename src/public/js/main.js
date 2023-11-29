const socket = io();

const chatBox = document.querySelector("#chatBox");
let user;

Swal.fire({
  title: "Bienvenido",
  text: "Ingrese su nombre para continuar",
  input: "text",
  inputValidator: (value) => {
    return !value && "Necesitas identificarte";
  },
  allowOutsideClick: false,
}).then((value) => {
  user = value.value;
  socket.emit("inicio", user);
});

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    socket.emit("message", {
      user: user,
      message: e.target.value,
    });
    chatBox.value = "";
  }
});

socket.on("messages", (data) => {
  const log = document.querySelector("#messages");
  let messages = "";

  data.forEach((message) => {
    messages += `<strong>${message.user}</strong>: ${message.message}</br>`;
  });

  log.innerHTML = messages;
});

socket.on("connected", (data) => {
  if (user !== undefined) {
    Swal.fire({
      text: `Nuevo usuario conectado: ${data}`,
      toast: true,
      position: "top-right",
    });
  }
});
