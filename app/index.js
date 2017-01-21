import style from './style.css'

const div = document.createElement('div')

div.className = 'foobarGlobal ' + style.foobarLocal

document.body.appendChild(div).textContent = 'css modules'

console.info('style', style)
