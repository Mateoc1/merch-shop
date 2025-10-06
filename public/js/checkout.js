document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("checkoutForm");
    const orderItemsContainer = document.getElementById("orderItems");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");

    // Cargar productos del carrito
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = 0;

    orderItemsContainer.innerHTML = "";
    cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("order-item");
        div.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderItemsContainer.appendChild(div);
        subtotal += item.price * item.quantity;
    });

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;

    // Procesar envío del formulario
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const order = {
            id: "ORD-" + Date.now(),
            customer: {
                firstName: formData.get("firstName"),
                lastName: formData.get("lastName"),
                email: formData.get("email"),
                phone: formData.get("phone")
            },
            shipping: {
                address: formData.get("address"),
                city: formData.get("city"),
                postalCode: formData.get("postalCode"),
                province: formData.get("province")
            },
            payment: formData.get("paymentMethod"),
            total: subtotal,
            items: cart,
            date: new Date().toISOString()
        };

        // Guardar pedido en localStorage
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        // Vaciar carrito
        localStorage.removeItem("cart");

        // Redirigir a pantalla de éxito
        window.location.href = `/order-success.html?orderId=${order.id}`;
    });

    // Cambiar visibilidad de campos tarjeta
    document.querySelectorAll("input[name='paymentMethod']").forEach(input => {
        input.addEventListener("change", () => {
            const cardDetails = document.getElementById("cardDetails");
            cardDetails.style.display = input.value === "credit-card" ? "block" : "none";
        });
    });
});

