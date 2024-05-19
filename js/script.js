document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const productCount = document.getElementById('product-count');
    const toggleLayoutButton = document.getElementById('toggle-layout');

    let mobileLayout = false;
    let desktopLayout = false;

    async function main() {
        const result = await fetch('https://desafio.xlow.com.br/search');
        const data = await result.json();
        productCount.textContent = data.length;
        data.forEach(async product => {
            try {
                const response = await fetch(`https://desafio.xlow.com.br/search/${product.productId}`);
                const productData = await response.json();
                createProductCard(productData);
            } catch (error) {
                console.error(`Error fetching data for product ${product.productId}: ${error}`);
            }
        });
    }

    async function createProductCard(productData) {
        const commertialOffer = productData[0].items[0].sellers[0].commertialOffer;
        const price = commertialOffer.Price;
        const priceWithoutDiscount = commertialOffer.PriceWithoutDiscount;
        const isDiscounted = price !== priceWithoutDiscount;
        const discountHTML = isDiscounted ? `<span class="discount-tag">${priceWithoutDiscount.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>` : '';
        
        let miniImagesHTML = '';
        productData[0].items.forEach((item, index) => {
            miniImagesHTML += `<img src="${item.images[0].imageUrl}" alt="${item.images[0].imageText}" title="${item.images[0].imageText}" class="mini-image" onclick="changeMainImage('${item.images[0].imageUrl}', 'main-product-image-${productData[0].productId}')">`;
        });

        const cardHTML = `
            <div class="product-card">
                <img src="${productData[0].items[0].images[0].imageUrl}" alt="${productData[0].productName}" title="${productData[0].items[0].images[0].imageText}" class="product-img" id="main-product-image-${productData[0].productId}">
                <h3 class="product-name">${productData[0].productName}</h3>
                <div class="mini">${miniImagesHTML}</div>
                ${discountHTML}
                <p class="product-price ${isDiscounted ? 'discounted' : ''}"> ${price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</p>
                <button class="buy-button">Comprar</button>
            </div>`;
        productGrid.insertAdjacentHTML('afterbegin', cardHTML);
    }

    main();

    toggleLayoutButton.addEventListener('click', () => {
        if (window.innerWidth < 769) {
            mobileLayout = !mobileLayout;
            productGrid.classList.toggle('two-columns', mobileLayout);
        } else {
            desktopLayout = !desktopLayout;
            productGrid.classList.toggle('five-columns', desktopLayout);
        }
    });
});

function changeMainImage(newImageSrc, mainImageId) {
    const mainProductImage = document.getElementById(mainImageId);
    mainProductImage.src = newImageSrc;
}
