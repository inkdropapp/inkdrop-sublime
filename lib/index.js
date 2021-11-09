const { logger } = require('inkdrop')
const sublimeKeymap = require('./sublime')
const { CompositeDisposable } = require('event-kit')
const CodeMirror = require('codemirror')

class SublimePlugin {
  activate() {
    sublimeKeymap(CodeMirror)
    if (inkdrop.isEditorActive()) {
      this.activateMode(inkdrop.getActiveEditor())
    }
    inkdrop.onEditorLoad(this.handleEditorLoad)
  }

  deactivate() {
    if (this.disposables) {
      this.disposables.dispose()
    }
    if (inkdrop.isEditorActive()) {
      this.deactivateMode(inkdrop.getActiveEditor())
    }
  }

  handleEditorLoad = editor => {
    this.activateMode(editor)
  }

  activateMode = editor => {
    const { cm } = editor
    const el = cm.getWrapperElement()
    el.classList.add('sublime-mode')
    this.registerCommands()
  }

  deactivateMode = editor => {
    const { cm } = editor
    if (cm && this.originalKeyMap) {
      const el = cm.getWrapperElement()
      el.classList.remove('sublime-mode')
    }
  }

  registerCommands() {
    const disposables = new CompositeDisposable()
    const editor = inkdrop.getActiveEditor()
    const { cm } = editor
    const wrapper = cm.getWrapperElement()

    const h = cmd => {
      return e => {
        e.preventDefault()
        e.stopPropagation()
        logger.debug('exec command:', cmd, e)
        cm.execCommand(cmd)
      }
    }

    const handlers = {
      'sublime:go-line-start-smart': h('goLineStartSmart'),
      'sublime:indent-less': h('indentLess'),
      'sublime:delete-line': h('deleteLine'),
      'sublime:wrap-lines': h('wrapLines'),
      'sublime:go-subword-left': h('goSubwordLeft'),
      'sublime:go-subword-right': h('goSubwordRight'),
      'sublime:scroll-line-up': h('scrollLineUp'),
      'sublime:scroll-line-down': h('scrollLineDown'),
      'sublime:select-line': h('selectLine'),
      'sublime:split-selection-by-line': h('splitSelectionByLine'),
      'sublime:single-selection-top': h('singleSelectionTop'),
      'sublime:insert-line-after': h('insertLineAfter'),
      'sublime:insert-line-before': h('insertLineBefore'),
      'sublime:select-next-occurrence': h('selectNextOccurrence'),
      'sublime:select-scope': h('selectScope'),
      'sublime:select-between-brackets': h('selectBetweenBrackets'),
      'sublime:go-to-bracket': h('goToBracket'),
      'sublime:swap-line-up': h('swapLineUp'),
      'sublime:swap-line-down': h('swapLineDown'),
      'sublime:toggle-comment-indented': h('toggleCommentIndented'),
      'sublime:join-lines': h('joinLines'),
      'sublime:duplicate-line': h('duplicateLine'),
      'sublime:sort-lines': h('sortLines'),
      'sublime:reverse-sort-lines': h('reverseSortLines'),
      'sublime:sort-lines-insensitive': h('sortLinesInsensitive'),
      'sublime:reverse-sort-lines-insensitive': h(
        'reverseSortLinesInsensitive'
      ),
      'sublime:next-bookmark': h('nextBookmark'),
      'sublime:prev-bookmark': h('prevBookmark'),
      'sublime:toggle-bookmark': h('toggleBookmark'),
      'sublime:clear-bookmarks': h('clearBookmarks'),
      'sublime:select-bookmarks': h('selectBookmarks'),
      'sublime:smart-backspace': h('smartBackspace'),
      'sublime:skip-and-select-next-occurrence': h(
        'skipAndSelectNextOccurrence'
      ),
      'sublime:del-line-right': h('delLineRight'),
      'sublime:upcase-at-cursor': h('upcaseAtCursor'),
      'sublime:downcase-at-cursor': h('downcaseAtCursor'),
      'sublime:set-sublime-mark': h('setSublimeMark'),
      'sublime:select-to-sublime-mark': h('selectToSublimeMark'),
      'sublime:delete-to-sublime-mark': h('deleteToSublimeMark'),
      'sublime:swap-with-sublime-mark': h('swapWithSublimeMark'),
      'sublime:sublime-yank': h('sublimeYank'),
      'sublime:show-in-center': h('showInCenter'),
      'sublime:clear-bookmarks': h('clearBookmarks'),
      'sublime:del-line-left': h('delLineLeft'),
      'sublime:fold-all': h('foldAll'),
      'sublime:unfold-all': h('unfoldAll'),
      'sublime:unfold-all': h('unfoldAll'),
      'sublime:add-cursor-to-prev-line': h('addCursorToPrevLine'),
      'sublime:add-cursor-to-next-line': h('addCursorToNextLine'),
      'sublime:find-under': h('findUnder'),
      'sublime:find-under-previous': h('findUnderPrevious'),
      'sublime:find-all-under': h('findAllUnder'),
      'sublime:fold': h('fold'),
      'sublime:unfold': h('unfold'),
      'sublime:find-incremental': h('findIncremental'),
      'sublime:find-incremental-reverse': h('findIncrementalReverse'),
      'sublime:replace': h('replace'),
      'sublime:find-next': h('findNext'),
      'sublime:find-prev': h('findPrev')
    }
    disposables.add(inkdrop.commands.add(wrapper, handlers))
    this.disposables = disposables
  }

  getCodeMirror() {
    return inkdrop.getActiveEditor().cm
  }
}

module.exports = new SublimePlugin()
