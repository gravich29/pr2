$(document).ready(function () {
  // Инициализация Toastr
  toastr.options = {
      closeButton: true,
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
  }

  let products = []
  let cart = JSON.parse(localStorage.getItem('cart')) || []

  // Блок работы с товарами
  function loadProducts() {
      setTimeout(() => {
          const mockProducts = [
              { id: 1, name: 'Смартфон', price: 25000, category: 'Электроника' },
              { id: 2, name: 'Ноутбук', price: 65000, category: 'Электроника' },
              { id: 3, name: 'Наушники', price: 5000, category: 'Электроника' },
              { id: 4, name: 'Футболка', price: 1500, category: 'Одежда' },
              { id: 5, name: 'Джинсы', price: 3000, category: 'Одежда' },
              { id: 6, name: 'Книга', price: 800, category: 'Книги' },
              { id: 7, name: 'Кофеварка', price: 4500, category: 'Бытовая техника' },
              { id: 8, name: 'Чайник', price: 2000, category: 'Бытовая техника' },
          ]

          products = mockProducts
          renderProducts(products)
          toastr.success('Товары успешно загружены')
      }, 1000)
  }

  function renderProducts(productsToRender) {
      const $productsContainer = $('#products')
      $productsContainer.empty()

      if (productsToRender.length === 0) {
          $productsContainer.append('<div class="empty-cart">Товары не найдены</div>')
          return
      }

      productsToRender.forEach(product => {
          const inCart = cart.some(item => item.id === product.id)
          const buttonText = inCart ? 'В корзине' : 'Добавить'
          const buttonClass = inCart ? 'in-cart' : 'add-to-cart'

          $productsContainer.append(`
              <div class="product" data-id="${product.id}">
                  <div>
                      <h3>${product.name}</h3>
                      <p>${product.price} ₽</p>
                      <small>Категория: ${product.category}</small>
                  </div>
                  <button class="${buttonClass}" ${inCart ? 'disabled' : ''}>
                      ${buttonText}
                  </button>
              </div>
          `)
      })
  }
