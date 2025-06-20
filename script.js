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
			$productsContainer.append(
				'<div class="empty-cart">Товары не найдены</div>'
			)
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

	function renderCart() {
		const $cartItems = $('#cart-items')
		$cartItems.empty()

		if (cart.length === 0) {
			$cartItems.append('<div class="empty-cart">Корзина пуста</div>')
			$('#total').text('0')
			return
		}

		cart.forEach(item => {
			$cartItems.append(`
            <div class="cart-item" data-id="${item.id}">
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.price} ₽ x ${item.quantity}</p>
                </div>
                <div>
                    <button class="increase">+</button>
                    <button class="decrease">-</button>
                    <button class="delete-btn">Удалить</button>
                </div>
            </div>
        `)
		})

		updateTotal()
	}

	function updateTotal() {
		const total = cart.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		)
		$('#total').text(total)
	}

	function saveCart() {
		localStorage.setItem('cart', JSON.stringify(cart))
	}

	function addToCart(productId) {
		const product = products.find(p => p.id === productId)
		if (!product) return

		const existingItem = cart.find(item => item.id === productId)

		if (existingItem) {
			existingItem.quantity += 1
		} else {
			cart.push({
				...product,
				quantity: 1,
			})
		}

		saveCart()
		renderCart()
		renderProducts(products)
		toastr.success('Товар добавлен в корзину')
	}

	function removeFromCart(productId) {
		cart = cart.filter(item => item.id !== productId)
		saveCart()
		renderCart()
		renderProducts(products)
		toastr.info('Товар удален из корзины')
	}

	function updateQuantity(productId, change) {
		const item = cart.find(item => item.id === productId)
		if (!item) return

		item.quantity += change

		if (item.quantity <= 0) {
			removeFromCart(productId)
		} else {
			saveCart()
			renderCart()
		}
	}

	//Блок фильтрации и сортировки - разработчик: Хажеев

	function filterAndSortProducts() {
		const searchTerm = $('#search').val().toLowerCase()
		const sortValue = $('#sort').val()

		let filteredProducts = products.filter(
			product =>
				product.name.toLowerCase().includes(searchTerm) ||
				product.category.toLowerCase().includes(searchTerm)
		)

		switch (sortValue) {
			case 'name-asc':
				filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
				break
			case 'name-desc':
				filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
				break
			case 'price-asc':
				filteredProducts.sort((a, b) => a.price - b.price)
				break
			case 'price-desc':
				filteredProducts.sort((a, b) => b.price - a.price)
				break
		}

		renderProducts(filteredProducts)
	}

	function clearCart() {
		cart = []
		saveCart()
		renderCart()
		renderProducts(products)
		toastr.info('Корзина очищена')
	}

	function checkout() {
		if (cart.length === 0) {
			toastr.warning('Корзина пуста')
			return
		}

		setTimeout(() => {
			toastr.success('Заказ успешно оформлен!')
			clearCart()
		}, 1500)
	}

	function showConfirmModal(message, callback) {
		$('#modal-message').text(message)
		$('#confirmModal').show()

		$('#confirm-yes')
			.off()
			.on('click', function () {
				$('#confirmModal').hide()
				callback()
			})

		$('#confirm-no')
			.off()
			.on('click', function () {
				$('#confirmModal').hide()
			})
	}

	// Обработчики событий
	$(document).on('click', '.add-to-cart', function () {
		const productId = $(this).closest('.product').data('id')
		addToCart(productId)
	})

	$(document).on('click', '.delete-btn', function () {
		const productId = $(this).closest('.cart-item').data('id')
		removeFromCart(productId)
	})

	$(document).on('click', '.increase', function () {
		const productId = $(this).closest('.cart-item').data('id')
		updateQuantity(productId, 1)
	})

	$(document).on('click', '.decrease', function () {
		const productId = $(this).closest('.cart-item').data('id')
		updateQuantity(productId, -1)
	})

	$('#clear-cart').on('click', function () {
		if (cart.length === 0) {
			toastr.warning('Корзина уже пуста')
			return
		}
		showConfirmModal('Вы уверены, что хотите очистить корзину?', clearCart)
	})

	$('#checkout').on('click', checkout)

	$('#search').on('input', filterAndSortProducts)
	$('#sort').on('change', filterAndSortProducts)

	$('.close').on('click', function () {
		$('#confirmModal').hide()
	})

	$(window).on('click', function (event) {
		if ($(event.target).is('#confirmModal')) {
			$('#confirmModal').hide()
		}
	})

	// Инициализация приложения
	loadProducts()
	renderCart()
})
