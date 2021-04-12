import InputOneEmail from "./InputOneEmail"

export default class InputEmails {
    constructor(containerNode, options) {
        this.containerNode = containerNode
        this.options = Object.assign(
            {
                placeholder: "add more emails...",
                containerClassName: "emails-input",
                currentNodeClassName: "emails-input-current-node",
                onChange: newValues => {},
            },
            options
        )
        this.__listeners = Object.freeze({
            keydown: this.keyDownHandler.bind(this),
            blur: this.blurHandler.bind(this),
            paste: this.pasteHandler.bind(this),
        })
        this.values = {}
        this.lastEmailNode = null
        this.currentNode = this.buildOneEmailNode()

        this.containerNode.addEventListener("click", () => {
            this.currentNode.focus()
        })
        this.containerNode.classList.add(this.options.containerClassName)
        this.containerNode.appendChild(this.currentNode)
    }

    addEmail(value) {
        if (value.trim().length === 0) {
            return
        }
        const emailNode = new InputOneEmail(value, this.lastEmailNode, null, {
            onRemove: this.removeEmailNode.bind(this),
        })
        if (this.lastEmailNode) {
            this.lastEmailNode.next = emailNode
        }
        this.values[value] = emailNode
        this.containerNode.insertBefore(
            emailNode.htmlNode,
            this.containerNode.lastChild
        )
        this.lastEmailNode = emailNode
        this.currentNode.value = ""
        this.onChangeHandler()
    }

    emails({ onlyValid = false }) {
        const result = []
        let node = this.lastEmailNode
        while (node !== null) {
            if (node && (!onlyValid || node.isValid)) {
                result.unshift(node.value)
            }
            node = node.prev
        }
        return result
    }

    setEmails(emails) {
        let node = this.lastEmailNode
        while (node !== null) {
            this.removeEmailNode(node, true)
            node = node.prev
        }
        emails.forEach(this.addEmail.bind(this))
    }

    buildOneEmailNode() {
        const input = document.createElement("input")
        input.setAttribute("autocomplete", "off")
        input.setAttribute("placeholder", this.options.placeholder)
        input.classList.add(this.options.currentNodeClassName)
        input.classList.add(this.options.currentNodeClassName)
        for (const eventName in this.__listeners) {
            const handler = this.__listeners[eventName]
            input.addEventListener(eventName, handler)
        }
        return input
    }

    keyDownHandler(event) {
        if (event.keyCode === 188 || event.keyCode === 13) {
            event.preventDefault()
            this.addEmail(this.currentNode.value)
        } else {
            if (event.keyCode === 8 && this.currentNode.value.length === 0) {
                event.preventDefault()
                if (this.lastEmailNode) {
                    this.removeEmailNode(this.lastEmailNode)
                }
            }
        }
    }

    blurHandler(_event) {
        if (this.currentNode.value.trim().length !== 0) {
            this.addEmail(this.currentNode.value)
        }
    }

    pasteHandler(event) {
        event.preventDefault()
        const paste = (event.clipboardData || window.clipboardData).getData(
            "text"
        )
        const pastedValues = paste.split(",")
        pastedValues.forEach(value => {
            this.addEmail(value)
        })
    }

    onChangeHandler() {
        this.options.onChange(this.emails({}))
    }

    removeEmailNode(emailNode, silently = false) {
        const nextNode = emailNode.next
        if (nextNode) {
            nextNode.prev = emailNode.prev
        }
        const prevNode = emailNode.prev
        if (prevNode) {
            prevNode.next = nextNode
        }
        if (emailNode === this.lastEmailNode) {
            this.lastEmailNode = prevNode
        }
        emailNode.htmlNode.remove()
        delete this.values[emailNode.value]
        if (!silently) {
            this.onChangeHandler()
        }
    }
}
