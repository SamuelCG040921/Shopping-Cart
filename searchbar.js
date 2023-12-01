const bar = document.getElementById('searchInput')

bar.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );

    containerCards.innerHTML = '';

    filteredProducts.forEach(product => createCards(product));
});