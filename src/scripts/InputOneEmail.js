export default class InputOneEmail {
  constructor (value, prev, next, options) {
    this.options = Object.assign(
      {
        containerClassName: 'email-node',
        contentClassName: 'email-node__content',
        removeBtnClassName: 'email-node__remove-email',
        onRemove: (emailNode) => {},
        invalidContainerClassName: 'email-node--invalid'
      }, options)

    this.value = value
    this.prev = prev
    this.next = next
    this.containerNode = document.createElement('div')
    const containerClassName = this.isValid ? this.options.containerClassName : this.options.invalidContainerClassName
    this.containerNode.classList.add(containerClassName)

    this.contentNode = document.createElement('div')
    this.contentNode.classList.add(this.options.contentClassName)
    this.contentNode.textContent = this.value

    this.removeBtnNode = this.__buildRemoveBtn()

    this.containerNode.appendChild(this.contentNode)
    this.containerNode.appendChild(this.removeBtnNode)
  }

  get htmlNode () {
    return this.containerNode
  }

  get isValid () {
    return this.value.indexOf('@') !== -1
  }

  __buildRemoveBtn () {
    const button = document.createElement('div')
    button.classList.add(this.options.removeBtnClassName)
    button.addEventListener('click', (_event) => { this.options.onRemove(this) })
    return button
  }
}
