import React, { useEffect } from 'react';

export default function SelectableText({ children, theme }) {
    let activeInput = null;
    let highlighted = null;

    function cleanupInput() {
        if (activeInput) {
            activeInput.remove();
            activeInput = null;
        }
    }

    function onMouseUp(e) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const text = selection.toString().trim();
        if (!text) return;

        const range = selection.getRangeAt(0);
        if (!e.currentTarget.contains(range.commonAncestorContainer)) return;

        if (e.button === 0) {
            const span = document.createElement('span');
            span.className = 'highlighted-word';
            span.textContent = text;
            span.style.backgroundColor = 'yellow';
            span.style.padding = '2px 4px';
            span.style.borderRadius = '3px';
            span.style.cursor = 'pointer';

            range.deleteContents();
            range.insertNode(span);
            selection.removeAllRanges();

            span.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                createInputModal(span, theme);
            });

            span.addEventListener('click', () => {
                cleanupInput();
            });

            highlighted = span;
        }
    }

    function createInputModal(span, theme) {
        cleanupInput();

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Заменить на...';
        input.className = 'replacement-input';

        input.style.cssText = `
            position: absolute;
            top: -30px;
            left: 0;
            min-width: 120px;
            padding: 4px 8px;
            border: 1px solid ${theme === 'dark' ? '#3b82f6' : '#2563eb'};
            border-radius: 4px;
            font-size: 13px;
            background: ${theme === 'dark' ? '#1f2937' : 'white'};
            color: ${theme === 'dark' ? '#f3f4f6' : '#111827'};
            z-index: 100;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
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

    function onKeyDown(e) {
        if (e.key === 'Delete') {
            document.querySelectorAll('.highlighted-word, .strikethrough-word').forEach(el => {
                el.remove();
            });
        }
    }

    useEffect(() => {
        const container = document.getElementById('selectable-container');

        if (!container) return;

        container.addEventListener('mouseup', onMouseUp);
        window.addEventListener('keydown', onKeyDown);

        return () => {
            container.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    return (
        <div
            id="selectable-container"
            className={`selectable-text ${theme === 'dark' ? 'text-gray-300 dark' : 'text-gray-700'}`}
            style={{
                userSelect: 'text',
                cursor: 'text',
                lineHeight: '1.6',
                wordSpacing: '0.1em',
            }}
        >
            {children}
        </div>
    );
}
