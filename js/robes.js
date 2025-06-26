// Функции только для страницы халатов
class RobesPage {
    static initFilters() {
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', this.filterRobes);
        });
    }
    
    static filterRobes() {
        const category = document.querySelector('.robes-filters select:first-child').value;
        const material = document.querySelector('.robes-filters select:last-child').value;
        
        // Здесь будет логика фильтрации
        console.log(`Фильтр: Категория - ${category}, Материал - ${material}`);
    }
}

// Инициализация только если мы на странице халатов
if (document.querySelector('.robes-page')) {
    document.addEventListener('DOMContentLoaded', () => {
        RobesPage.initFilters();
    });
}