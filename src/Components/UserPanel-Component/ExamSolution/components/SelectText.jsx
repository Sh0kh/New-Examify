import React, { useEffect } from 'react';

export default function SelectableText({ children, theme }) {
    let activeInput = null;
    let lastHighlighted = null;

    function cleanupInput() {
        if (activeInput) {
            activeInput.remove();
            activeInput = null;
        }
    }

    function createDeleteButton(span) {
        const btn = document.createElement('button');
        btn.innerHTML = '&times;';
        btn.title = 'Отменить';
        btn.className = 'delete-btn';

        btn.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            width: 20px;
            height: 20px;
            border: none;
            border-radius: 50%;
            background: red;
            color: white;
            font-size: 14px;
            line-height: 1;
            cursor: pointer;
            display: none;
            z-index: 1000;
            pointer-events: auto;
        `;

        span.style.position = 'relative';
        span.appendChild(btn);

        // Всегда скрываем кнопку при создании
        btn.style.display = 'none';

        span.addEventListener('mouseenter', () => {
            btn.style.display = 'block';
        });

        span.addEventListener('mouseleave', () => {
            btn.style.display = 'none';
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = span.parentNode;
            
            // Создаем текстовый узел с содержимым span (исключаем кнопку и инпут)
            let textContent = '';
            
            function extractTextContent(node) {
                for (let child of node.childNodes) {
                    if (child.nodeType === Node.TEXT_NODE) {
                        textContent += child.textContent;
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        // Пропускаем служебные элементы
                        if (!child.classList.contains('delete-btn') && 
                            !child.classList.contains('replacement-input')) {
                            extractTextContent(child);
                        }
                    }
                }
            }
            
            extractTextContent(span);
            
            const textNode = document.createTextNode(textContent);
            parent.replaceChild(textNode, span);
            cleanupInput();
        });
    }

    function createInputModal(span) {
        cleanupInput();

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Write here...';
        input.className = 'replacement-input';

        input.style.cssText = `
            position: absolute;
            top: -30px;
            left: 0;
            min-width: 120px;
            border: 1px solid #2563eb;
            border-radius: 4px;
            font-size: 13px;
            background: white;
            color: #111827;
            z-index: 100;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            padding: 4px 8px;
        `;

        span.appendChild(input);
        input.focus();
        activeInput = input;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = input.value.trim();
                if (value) {
                    span.setAttribute('data-replacement', value);
                    span.title = value;
                }
                cleanupInput();
            } else if (e.key === 'Escape') {
                cleanupInput();
            }
        });

        input.addEventListener('blur', () => {
            cleanupInput();
        });
    }

    function onMouseUp(e) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const text = selection.toString().trim();
        if (!text) return;

        const range = selection.getRangeAt(0);
        const container = document.getElementById('selectable-container');
        if (!container.contains(range.commonAncestorContainer)) return;

        if (e.button === 0) {
            const span = document.createElement('span');
            span.className = 'highlighted-word';

            // Применяем только фон и курсор, остальные стили наследуются
            span.style.cssText = `
                background-color: yellow;
                border-radius: 3px;
                cursor: pointer;
            `;

            // Копируем выделенный текст без изменения структуры
            const clonedContent = range.cloneContents();
            span.appendChild(clonedContent);

            range.deleteContents();
            range.insertNode(span);
            selection.removeAllRanges();

            createDeleteButton(span);
            lastHighlighted = span;
        }
    }

    function onContextMenu(e) {
        const container = document.getElementById('selectable-container');
        if (!container.contains(e.target)) return;

        e.preventDefault();

        let span = e.target.closest('.highlighted-word');
        if (!span) return;

        const strikeSpan = document.createElement('span');
        strikeSpan.className = 'strikethrough-word';
        
        // Применяем только зачеркивание и фон, остальные стили наследуются
        strikeSpan.style.cssText = `
            text-decoration: line-through;
            background-color: rgba(37, 99, 235, 0.2);
            border-radius: 3px;
            cursor: pointer;
        `;

        // Переносим содержимое с сохранением форматирования
        while (span.firstChild) {
            strikeSpan.appendChild(span.firstChild);
        }

        span.replaceWith(strikeSpan);
        
        // Создаем кнопку удаления для зачеркнутого элемента
        createDeleteButton(strikeSpan);
        lastHighlighted = strikeSpan;

        createInputModal(strikeSpan);
    }

    useEffect(() => {
        const container = document.getElementById('selectable-container');
        if (!container) return;

        container.addEventListener('mouseup', onMouseUp);
        document.addEventListener('contextmenu', onContextMenu);

        return () => {
            container.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('contextmenu', onContextMenu);
        };
    }, []);

    return (
        <div
            id="selectable-container"
            className={`selectable-text ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}
            style={{
                userSelect: 'text',
                cursor: 'text',
            }}
        >
            {children}
        </div>
    );
}