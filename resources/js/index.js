'use strict'

const objButtons = [
    { cssClass: 'btn-memory', value: 'mc', id: 'memoryClear' },
    { cssClass: 'btn-memory', value: 'mr', id: 'memoryRetrieve' },
    { cssClass: 'btn-memory', value: 'ms', id: 'memoryStorage' },
    { cssClass: 'btn-memory', value: 'm+', id: 'memoryAdd' },
    { cssClass: 'btn-memory', value: 'm-', id: 'memorySubtract' },
    { cssClass: 'btn-memory', value: 'ce', id: 'clearError' },

    { cssClass: 'btn-operand', value: '1' },
    { cssClass: 'btn-operand', value: '2' },
    { cssClass: 'btn-operand', value: '3' },
    { cssClass: 'btn-operator', value: '+' },
    { cssClass: 'btn-operand', value: '4' },
    { cssClass: 'btn-operand', value: '5' },
    { cssClass: 'btn-operand', value: '6' },
    { cssClass: 'btn-operator', value: '-' },
    { cssClass: 'btn-operand', value: '7' },
    { cssClass: 'btn-operand', value: '8' },
    { cssClass: 'btn-operand', value: '9' },
    { cssClass: 'btn-operator', value: '*' },
    { cssClass: 'btn-operand', value: '0' },
    { cssClass: 'btn-operand', value: '.' },
    { cssClass: 'btn-clear', value: 'C' },
    { cssClass: 'btn-operator', value: '/' },
    { cssClass: 'btn-erase', value: '&LeftArrowBar;', id: 'Backspace' },
    { cssClass: 'btn-operator', value: '(' },
    { cssClass: 'btn-operator', value: ')' },
    { cssClass: 'btn-equals', value: '=', id: 'Enter' }
]

let displayData = ''

class Memory {
    #memory

    constructor() {
        this.#memory = [null] // [0] Oldest memory to [-1] newest memory
    }

    getMemory = () => this.#memory

    memoryClear = () => this.#memory = [null]

    memoryRetrieve = () => this.#memory.slice(-1)[0]

    memoryStorage = (newMemory) => {
        this.#memory.push(newMemory)
        return null
    }

    memoryAdd = (termToSum) => {
        if (this.memoryRetrieve() !== null) this.#memory.push(this.memoryRetrieve() + termToSum)
    }

    memorySubtract = (termToSubtract) => {
        if (this.memoryRetrieve() !== null) this.#memory.push(this.memoryRetrieve() - termToSubtract)
    }

    clearError = () => {
        if (this.memoryRetrieve() !== null) this.#memory.pop()
        return this.memoryRetrieve()
    }
}

const memory = new Memory()

document.addEventListener('DOMContentLoaded', event => {

    const inputHandler = event => {
        const item = event instanceof PointerEvent ?
            event.target.innerText :
            event instanceof KeyboardEvent ? event.key : ''

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
        const { cssClass, value, id } = objButton

        const item = `<button class="${cssClass}" id=${id ? id : value}>${value}</button>`

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
        if (key === 'Backspace') eraseHandler(event)
        if (key === 'Enter') equalsHandler(event)
    })

    const memoryButtons = document.querySelectorAll('.btn-memory')

    memoryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const memoryOperation = event.target.id
            const inconditionalOperations = ['memoryClear', 'memoryRetrieve', 'clearError']
            if (new RegExp('^-{0,1}[0-9.]{1,}$').exec(display.value) || inconditionalOperations.includes(memoryOperation)) {
                if (memoryOperation === 'memoryClear') {
                    if (confirm('Esta operación borra toda la memoria almacenada, está de acuerdo?')) {
                        memory[memoryOperation]()
                    }
                } else {
                    const result = memory[memoryOperation](parseFloat(display.value));
                    if (!result && memoryOperation === 'clearError') alert('Memoria vacía')
                    display.value = result ? result : display.value
                }
            }
        })
    })
})
