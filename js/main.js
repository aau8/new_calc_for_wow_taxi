// Удаляет у всех элементов items класс itemClass
function removeAll(items,itemClass) {   
    if (typeof items == 'string') {
      items = document.querySelectorAll(items)
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      item.classList.remove(itemClass)
    }
}

const selectElems = document.querySelectorAll('.select')

for (let i = 0; i < selectElems.length; i++) {
    const select = selectElems[i];
    const input = select.querySelector('.select__input input')
    const dropdown = select.querySelector('.select__dropdown')
    const itemElems = dropdown.querySelectorAll('.select__item')

    input.addEventListener('focus', e => {
        removeAll('.select', '_open')
        select.classList.add('_open')
    })

    input.addEventListener('input', e => {
        const value = input.value.toLowerCase()

        if (value === '') {
            removeAll(itemElems, '_show')

            for (let i = 0; i < 3; i++) {
                const elem = itemElems[i];    
                elem.classList.add('_show')
            }
        }
        else {
            const array = Array.from(itemElems).filter(e => {
                return e.innerHTML.toLowerCase().includes(value)
            })
    
            removeAll(itemElems, '_show')
    
            for (let i = 0; i < array.length; i++) {
                const elem = array[i];
                elem.classList.add('_show')
            }
        }
    })

    for (let i = 0; i < itemElems.length; i++) {
        const item = itemElems[i];
        
        item.addEventListener('click', e => {
            input.value = item.innerHTML
            select.classList.remove('_open')

            removeAll(itemElems, '_selected')
            item.classList.add('_selected')

            calcPrice()
        })
    }

    window.addEventListener('click', e => {
        const target = e.target

        if (document.querySelector('.select._open') && !target.classList.contains('select') && !target.closest('.select')) {
            select.classList.remove('_open')

            if (select.querySelector('.select__item._selected')) {
                input.value = select.querySelector('.select__item._selected').innerHTML
            }
            else {
                input.value = ''
            }
        }
    })
}

// Посчитать цену относительно указанных городов в полях выбора
function calcPrice() {
    if (checkInputsCity()) {
        const where = document.getElementById('where').querySelector('.select__item._selected')
        const whereFrom = document.getElementById('where-from').querySelector('.select__item._selected')
        const whereCityId = Number(where.dataset.cityId)
        const whereFromCityId = Number(whereFrom.dataset.cityId)
        const priceContainer = document.querySelector('.price')

        fetch('./cities.json')
            .then(data => data.json())
            .then(json => {
                const priceTable = json[whereFromCityId-1]
                const price = priceTable[whereCityId-1]
                console.log(priceTable, price)
                priceContainer.innerText = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(price)
            })
            .catch(err => console.log(err))
    }
}

// Проверка изменения инпут с местоположениями
function checkInputsCity() {
    const where = document.getElementById('where')
    const whereFrom = document.getElementById('where-from')

    for (let i = 0; i < [where, whereFrom].length; i++) {
        const select = [where, whereFrom][i];
        const input = select.querySelector('input')

        if (input.value === '') return false
    }

    return true
}