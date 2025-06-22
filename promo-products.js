// Таймер акции
function updateSaleTimer() {
    const endDate = new Date('2023-12-31T23:59:59');
    const now = new Date();
    const diff = endDate - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    document.querySelector('.promo-content p').innerHTML = 
        `Осталось: ${days} дней ${hours} часов`;
}

// Вызывать каждую секунду
setInterval(updateSaleTimer, 1000);