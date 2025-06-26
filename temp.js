// Фильтрация пижам
document.querySelectorAll('.pajamas-filters select').forEach(select => {
    select.addEventListener('change', filterPajamas);
});

function filterPajamas() {
    const category = document.querySelector('.pajamas-filters select:first-child').value;
    const material = document.querySelector('.pajamas-filters select:last-child').value;
    
    // Здесь будет логика фильтрации
    console.log(`Фильтр: Категория - ${category}, Материал - ${material}`);
}