'use strict'

const objButtons = [
    { class: 'btn-operand', value: '1' },
    { class: 'btn-operand', value: '2' },
    { class: 'btn-operand', value: '3' },
    { class: 'btn-operator', value: '+' },
    { class: 'btn-operand', value: '4' },
    { class: 'btn-operand', value: '5' },
    { class: 'btn-operand', value: '6' },
    { class: 'btn-operator', value: '-' },
    { class: 'btn-operand', value: '7' },
    { class: 'btn-operand', value: '8' },
    { class: 'btn-operand', value: '9' },
    { class: 'btn-operator', value: '*' },
    { class: 'btn-operand', value: '0' },
    { class: 'btn-operand', value: '.' },
    { class: 'btn-clear', value: 'C' },
    { class: 'btn-operator', value: '/' },
    { class: 'btn-erase', value: '&LeftArrowBar;' },
    { class: 'btn-operator', value: '(' },
    { class: 'btn-operator', value: ')' },
    { class: 'btn-equals', value: '=' }
]

let displayData = ''

document.addEventListener('DOMContentLoaded', event => {

    const inputHandler = event => {
        const item = event instanceof PointerEvent ? event.target.innerText : event instanceof KeyboardEvent ? event.key : ''

        if (displayData === '') {
            displayData = new RegExp('[)*/]').exec(item) ? '' : displayData + item
        } else if (displayData.includes('Error:')) {
            displayData = ''
            display.value = displayData
        } else {
            const lastChar = displayData.slice(-1)[0]
            switch (item) {
                case '.':
                    const lastOperand = displayData.split(new RegExp('[+--*/()]')).slice(-1)[0]
                    displayData = lastOperand.includes('.') ? displayData : displayData + item
                    break
                case '(':
                    displayData = new RegExp('[0-9.]').exec(lastChar) ? displayData : displayData + item
                    break
                case ')':
                    displayData = new RegExp('[+--*/(]').exec(lastChar) ? displayData : displayData + item
                    break
                case '+':
                case '-':
                    displayData = new RegExp('[+--]').exec(lastChar) ? displayData : displayData + item
                    break
                case '*':
                case '/':
                    displayData = new RegExp('[+--*/(]').exec(lastChar) ? displayData : displayData + item
                    break
                default:
                    displayData += item
                    break
            }
        }
        display.value = displayData
    }

    const eraseHandler = event => {
        displayData = displayData.split('').slice(0, -1).join('')
        display.value = displayData
    }

    const equalsHandler = event => {
        try {
            if (displayData !== '') {
                const openBrackets = displayData.split('(').length - 1
                const closeBrackets = displayData.split(')').length - 1
                displayData = ((openBrackets === closeBrackets)) ? eval(displayData) : 'Error de paréntesis'
                displayData = parseFloat(displayData).toFixed(8)
                if (displayData % 1 !== 0) {
                    displayData = displayData.toString()
                    displayData = displayData.includes('.') ? displayData.replace(new RegExp('0{0,}$'), '') : displayData
                } else {
                    displayData = parseInt(displayData).toString()
                }
                display.value = displayData
            }
        } catch (error) {
            displayData = `Error: ${error}`
            display.value = displayData
        }
    }

    const divButtons = document.querySelector('.buttons')
    const display = document.querySelector('.display')

    objButtons.forEach(objButton => {
        const item = `<button class="${objButton.class}">${objButton.value}</button>`
        divButtons.insertAdjacentHTML('beforeend', item)
    })

    const buttons = document.querySelectorAll('.btn-operand, .btn-operator')

    buttons.forEach(button => {
        button.addEventListener('click', inputHandler)
    })

    document.querySelector('.btn-equals').addEventListener('click', equalsHandler)

    document.querySelector('.btn-clear').addEventListener('click', event => {
        displayData = ""
        display.value = displayData
    })

    document.querySelector('.btn-erase').addEventListener('click', eraseHandler)

    document.addEventListener('keyup', (event) => {
        const { key } = event
        if (new RegExp('^[0-9+--*/().=]$').exec(key)) inputHandler(event)
        if (key === 'Backspace') eraseHandler()
        if (key === 'Enter') equalsHandler()
    })
})
