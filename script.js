const fe = document.querySelector(".btn");
let containerli = document.querySelector(".container-produit");
let choixCategorie = document.querySelector(".choixCategorie");
const error = document.querySelector(".erreur");
const adress = "https://api-iota-henna.vercel.app"
let id = "";

function toggleBarre() {
  this.classList.toggle("barre");

}

const createAllBdTodos = (item) => {
  containerli.innerHTML = "";
  for (const todo of item.todos) {

    let produit = document.createElement("li");
    produit.innerHTML = ` <img class="new"  src="./asset/new.png">${todo.title}`;
    const divCheck = document.createElement("div");
    divCheck.classList.add("check");

    const btnDelete = document.createElement("img");
    btnDelete.classList.add("icone", "delete");
    btnDelete.setAttribute("id", `${todo.Id}`);
    btnDelete.setAttribute("src", "./asset/delete.png");

    btnDelete.addEventListener("click", (e) => {
      const parentProduit = e.target.closest("li");
      parentProduit.remove();
      deleteTodoFunction(e.target.id);
      console.log("test");
    });

    divCheck.appendChild(btnDelete);

    produit.setAttribute("id", `${todo.Id}`);
    produit.setAttribute("categorie", choixCategorie.value);
    produit.classList.add("produit");
    produit.setAttribute("draggable", true);
    produit.addEventListener("dragstart", () => {
      setTimeout(() => produit.classList.add("dragging"), 0);
    })
    produit.addEventListener("dragend", () => produit.classList.remove("dragging"));
    produit.addEventListener("click", toggleBarre);

    produit.appendChild(divCheck);
    containerli.appendChild(produit);

    const trenteMinute = 1800000;
    setTimeout(() => {
      const newImage = produit.querySelector(".new");

      if (newImage) {
        newImage.style.display = "none";
      }
    }, trenteMinute);
  }
}


const fetchData = (callback, id) => {
  fetch(adress+ "/api/todo/" , {
    method: "GET"
  })
    .then((res) => res.json())
    .then((data) => {
      if (callback && id) {
        callback(id);
      }
      if (callback && !id) {
        callback(data);
      }
      const message = data.message;

    })
    .catch((error) => {
      console.error('Erreur :', error);
    });
}
const deleteTodo = (id) => {
  fetch(adress + "/api/todo/" + id, {
    method: "DELETE"
  })
    .then((res) => res.json())
    .then((data) => {

      const message = data.message;
      console.log(message);
    })
    .catch((error) => {
      console.error('Erreur :', error);
    });

}


const deleteTodoFunction = (id) => {
  fetchData(deleteTodo, id)
}

const displayData = () => {
  fetchData(createAllBdTodos)
}
displayData();

const addData = (dataTodo) => {
  id = new Date().getTime();


  fetch(adress + "/api/todo/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: dataTodo.title,
      Id: id,
      userId: dataTodo.userId
    })
  })
    .then((res) => res.json())
    .then((data) => {

      const message = data.message;
      console.log(message);
    })
    .catch((error) => {
      console.error('Erreur :', error);
    });
}




const createTodo = (item) => {
  let produit = document.createElement("li");
  produit.innerHTML = ` <img class="new"  src="./asset/new.png">${item}`;
  const divCheck = document.createElement("div");
  divCheck.classList.add("check");

  const btnDelete = document.createElement("img");
  btnDelete.classList.add("icone", "delete");
  btnDelete.setAttribute("id", `${id}`);
  btnDelete.setAttribute("src", "./asset/delete.png");

  btnDelete.addEventListener("click", (e) => {
    const parentProduit = e.target.closest("li");
    parentProduit.remove();
    deleteTodoFunction(e.target.id);
    console.log("test");
  });

  divCheck.appendChild(btnDelete);

  produit.setAttribute("id", `${id}`);
  produit.setAttribute("categorie", choixCategorie.value);
  produit.classList.add("produit");
  produit.setAttribute("draggable", true);
  produit.addEventListener("dragstart", () => {
    setTimeout(() => produit.classList.add("dragging"), 0);
  })
  produit.addEventListener("dragend", () => produit.classList.remove("dragging"));
  produit.addEventListener("click", toggleBarre);
  produit.appendChild(divCheck);
  containerli.appendChild(produit);

  const trenteMinute = 1800000;
  setTimeout(() => {
    const newImage = produit.querySelector(".new");

    if (newImage) {
      newImage.style.display = "none";
    }
  }, trenteMinute);
}


fe.addEventListener("click", (event) => {
  fetchData();
  event.preventDefault();
  const item = document.querySelector(".item").value.trim();
  if (item.length < 30) {
    if (item == "") {
      fe.disabled = true;
      error.style.display = "flex";
      error.innerHTML = `Entré un produit <img class="icone" src="./asset/avertissement.png"></img>`;
      setTimeout(() => {
        error.style.display = "none";
        fe.disabled = false;
      }, 1000);
    } else {
      try {
        const infoTodo = {
          title: item,
          userId: 10
        }
        addData(infoTodo)
      } catch (e) {
        console.log(e);
      }
      createTodo(item);

    }

  }

  else {
    fe.disabled = true;
    error.style.display = "flex";
    error.innerHTML = `trop long <img class="icone" src="./asset/avertissement.png"></img>`;
    setTimeout(() => {
      error.style.display = "none";
      fe.disabled = false;
    }, 1000);
  }
  document.querySelector(".item").value = "";
});


const containerProduit = document.querySelector(".container-produit");

const next = (e) => {
  const siblings = [...containerProduit.querySelectorAll(".produit:not(.dragging)")];

  const draggingItem = containerProduit.querySelector(".dragging");

  let nextSibling = siblings.find(sibling => {
    return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
  });

  containerProduit.insertBefore(draggingItem, nextSibling)
};


containerProduit.addEventListener("dragover", next)