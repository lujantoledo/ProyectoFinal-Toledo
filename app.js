const contenedorDeProductos = document.getElementById('contenedor-de-productos');


const contenedorCarrito = document.getElementById('carrito-contenedor')
const botonVaciar = document.getElementById('vaciar-carrito')
const botonConfirmarCompra = document.getElementById('confirmar-compra')
const contadorCarrito = document.getElementById('contador-carrito')
const precioTotal = document.getElementById('precioTotal')
const botonDark = document.getElementById('boton-dark-mode')

// configuracion del modo oscuro
const temaOscuro = () =>{
    document.querySelector("body").setAttribute('data-bs-theme', "dark")
    document.querySelector("#modo").setAttribute('class', "bi bi-moon")
}

const temaClaro = () =>{
    document.querySelector("body").setAttribute('data-bs-theme', "light")
    document.querySelector("#modo").setAttribute('class', "bi bi-brightness-high-fill")
  
}

const cambiarTema = () =>{
    document.querySelector("body").getAttribute("data-bs-theme") === "light"?
    temaOscuro(): temaClaro()
}

document.addEventListener('DOMContentLoaded', () =>{
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
  
      actualizarCarrito()
    }
})


botonVaciar.addEventListener('click', ()=>{
    carrito.length = 0
    guardalLocalStorage()
    actualizarCarrito()
})

let carrito = JSON.parse(localStorage.getItem('carrito')) || [] //obtiene datos del carrito

botonConfirmarCompra.addEventListener('click', () => {
    Swal.fire(
        'Su Compra ha sido Confirmada!',
        'Muchas Gracias',
        'success'
      )
      carrito.length = 0
      guardalLocalStorage()
      actualizarCarrito()

})

//Manejo de promesas con fetch. 

//Cargo mis productos en el html
const getProductos = async () => {
    const response = await fetch("data.json");
    const data = await response.json();
    
    
    
    data.forEach((producto) => {
    const div = document.createElement('div')
    div.classList.add ('producto')
    console.log(data)
    div.innerHTML = `
             <img src= ${producto.imagen} alt = "">
            <h3>${producto.nombre}</h3>
            <p>Marca: ${producto.marca}</p>
            <p class="precioDeProducto"> Precio: $${producto.precio}</p>
             <div><button id="agregarproducto${producto.id}" class="btn btn-agregar "> Agregar <i class="bi bi-cart4"></i> </button></div>`

        contenedorDeProductos.appendChild(div)
        const boton = document.getElementById(`agregarproducto${producto.id}`)

        boton.addEventListener('click', () => {
         //Agrego esto
            const repeat = carrito.some((repeatProduct) => repeatProduct.id === producto.id);
            console.log(repeat)

            if (repeat) {
             carrito.map((prod) => {
                if (prod.id === producto.id) {
                    prod.cantidad++;
           
                    actualizarCarrito() 
          
                 }
             });
            } else {
             agregarAlCarrito(producto.id)
             }

    
    Toastify({
        text: "Producto agregado al carrito",
        duration: 1000,
        gravity: 'top',
        className: 'notificacion my-toast',
        style: {
            
            background: 'linear-gradient(to right, rgb(255, 165, 0), rgb(255, 165, 0))' }

    }).showToast();
    
} )

})
}



getProductos();






const agregarAlCarrito = (idProd) =>{
    const item =productos_alimentos.find ((prod) => prod.id === idProd )
    carrito.push(item)
    actualizarCarrito()
    console.log(carrito)

 

}

const eliminarDelCarrito = (prodId) =>{
    const item = carrito.find((prod) => prod.id === prodId)
    const indice = carrito.indexOf(item)
    carrito.splice(indice, 1)
    guardalLocalStorage()
    actualizarCarrito()
}

const actualizarCarrito = () => {
    contenedorCarrito.innerHTML = ""

    

    carrito.forEach((prod) =>{
        const div = document.createElement('div') //creo un div
        div.className= ('productoEnCarrito')
        div.innerHTML = `
        <p> ${prod.nombre}</p>
        <p> Precio: $ ${prod.precio}</p>
        <p> Cantidad: <span id="cantidad">${prod.cantidad}</span> </p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="bi bi-trash3-fill"></i></button>
        `

        contenedorCarrito.appendChild(div)
        //guardo en el local storage
        
        guardalLocalStorage()
    })
    
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)
    contadorCarrito.innerText = carrito.length
}


const guardalLocalStorage = () =>{
    localStorage.setItem ('carrito', JSON.stringify(carrito))
}
