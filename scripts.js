const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarning = document.getElementById('address-warning');

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex';
    updateCartModal();
});

// Fechar o modal do carrinho
cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Fechar o modal via botão fechar
closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Adicionar item ao carrinho
menu.addEventListener('click', (event) => {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute('data-name');
        const price = parseFloat(parentButton.getAttribute('data-price'));

        addToCart(name, price);
    }
});

// Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
        return;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
}

// Atualizar o carrinho na tela
function updateCartModal() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd:${item.quantity}</p>
                    <p class="font-medium mt-2">R$${item.price}.00</p>
                </div>
                <button class="font-bold remove-btn" data-name="${item.name}">Remover</button>
            </div>
        `;

        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Remover item do carrinho via click no modal
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
        const nome = event.target.getAttribute("data-name");
        removerItemCarrinho(nome);
    }
});

// Função para remover item do carrinho
function removerItemCarrinho(nome) {
    const index = cart.findIndex(item => item.name === nome);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            // Se a quantidade for 1, remove o item completamente do carrinho
            cart.splice(index, 1);
        }

        updateCartModal();  // Atualiza o modal após a remoção
    }
}

// Validar endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value

    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarning.classList.add("hidden")
    }
})

// Finalizar pedido
checkoutBtn.addEventListener("click", function() {

    const isOpen = checkOpen();
    if(!isOpen) {
        Toastify({
            text: "Ops... Restaurante fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return

    }

    if(cart.length === 0) return;

    if(addressInput.value === "") {
        // addressWarning.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
    }


    //Enviar o pedido para api Whats
    const cartItems = cart.map((item) => {
        return (
            `${item.name} - Quantidade: (${item.quantity}) - Preço: R$${item.price} | `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "+5551983117180"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart.length = 0
    updateCartModal();


})


//Verificar a hora atual e manipular o horario do restaurante
function checkOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22; // true

}

const spanItem = document.getElementById("date-span")

const isOpen = checkOpen()

if(isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}