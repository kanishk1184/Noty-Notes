import { Mark } from '@tiptap/core'

const FontSize = Mark.create({
  name: 'fontSize',

  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize.replace('px', ''),
        renderHTML: attributes => {
          if (!attributes.fontSize) return {};
          return {
            style: `font-size: ${attributes.fontSize}px`
          }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        style: 'font-size',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },

  addCommands() {
    return {
      setFontSize:
        fontSize => ({ commands }) => {
          return commands.setMark('fontSize', { fontSize })
        },
      unsetFontSize:
        () => ({ commands }) => {
          return commands.unsetMark('fontSize')
        },
    }
  }
})

export default FontSize;
