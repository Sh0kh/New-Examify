import React, { useEffect } from 'react';

export default function SelectableText({ children }) {
    let activeInput = null;

    function cleanupInput() {
        if (activeInput) {
            activeInput.remove();
            activeInput = null;
        }
    }

    function createDeleteButton(element) {
        // Проверяем, есть ли уже кнопка удаления
        if (element.querySelector('.delete-btn')) {
            return;
        }

        const btn = document.createElement('button');
        btn.innerHTML = '×';
        btn.title = 'Удалить выделение';
        btn.className = 'delete-btn';

        btn.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            width: 18px;
            height: 18px;
            border: none;
            border-radius: 50%;
            background: #dc2626;
            color: white;
            font-size: 12px;
            line-height: 1;
            cursor: pointer;
            display: none;
            z-index: 1001;
            pointer-events: auto;
            font-family: Arial, sans-serif;
            font-weight: bold;
        `;

        element.style.position = 'relative';
        element.appendChild(btn);

        const showButton = () => {
            btn.style.display = 'block';
        };

        const hideButton = () => {
            btn.style.display = 'none';
        };

        element.addEventListener('mouseenter', showButton);
        element.addEventListener('mouseleave', hideButton);

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            cleanupInput();

            if (!element || !element.parentNode) {
                console.error('Элемент или его родитель не существует');
                return;
            }

            const parent = element.parentNode;

            try {
                // Создаем текстовый узел с содержимым элемента (исключаем кнопку и инпут)
                let textContent = '';

                function extractTextContent(node) {
                    if (!node) return;

                    if (node.nodeType === Node.TEXT_NODE) {
                        textContent += node.textContent;
                    } else if (node.nodeType === Node.ELEMENT_NODE && node !== btn) {
                        // Пропускаем служебные элементы
                        if (!node.classList.contains('delete-btn') &&
                            !node.classList.contains('replacement-input')) {
                            for (let child of node.childNodes) {
                                extractTextContent(child);
                            }
                        }
                    }
                }

                for (let child of Array.from(element.childNodes)) {
                    extractTextContent(child);
                }

                if (textContent) {
                    const textNode = document.createTextNode(textContent);
                    parent.replaceChild(textNode, element);
                    parent.normalize();
                } else {
                    parent.removeChild(element);
                }
            } catch (error) {
                console.error('Ошибка при удалении элемента:', error);
                // Попытка принудительного удаления
                try {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                } catch (finalError) {
                    console.error('Не удалось удалить элемент:', finalError);
                }
            }
        });
    }

    function createInputModal(element) {
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

        element.appendChild(input);
        input.focus();
        activeInput = input;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = input.value.trim();
                if (value) {
                    element.setAttribute('data-replacement', value);
                    element.title = value;
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

    useEffect(() => {
        const handleMouseUp = (e) => {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const text = selection.toString().trim();
            if (!text) return;

            const range = selection.getRangeAt(0);
            if (!range || range.collapsed) return;

            // Проверяем, находится ли выделение в нашем контейнере
            const container = document.getElementById('selectable-container');
            if (!container || !container.contains(range.commonAncestorContainer)) return;

            // Получаем все узлы в выделении
            const selectedNodes = getNodesInRange(range);

            // Проверяем типы тегов в выделении
            const tagTypes = getTagTypesInSelection(selectedNodes);

            // Если смешанные теги или более одного типа тега - не выделяем
            if (tagTypes.size > 1) {
                selection.removeAllRanges();
                return;
            }

            // Проверяем сложность выделения (пересекает ли границы элементов)
            if (isComplexSelection(range)) {
                selection.removeAllRanges();
                return;
            }

            // Проверяем, есть ли уже выделение в этом месте
            const existingMark = isAlreadySelected(range);
            if (existingMark) {
                // Если да - удаляем выделение
                removeSelection(range, existingMark);
            } else {
                // Если нет - добавляем выделение
                addSelection(range);
            }

            selection.removeAllRanges();
        };

        const handleContextMenu = (e) => {
            const container = document.getElementById('selectable-container');
            if (!container || !container.contains(e.target)) return;

            e.preventDefault();

            let markElement = e.target.closest('mark.selected');
            if (!markElement) return;

            try {
                // Создаем зачеркнутый элемент
                const strikeElement = document.createElement('span');
                strikeElement.className = 'strikethrough-word';

                strikeElement.style.cssText = `
                    text-decoration: line-through;
                    background-color: rgba(37, 99, 235, 0.2);
                    border-radius: 3px;
                    cursor: pointer;
                    position: relative;
                `;

                // Переносим содержимое с сохранением форматирования
                while (markElement.firstChild) {
                    strikeElement.appendChild(markElement.firstChild);
                }

                if (markElement.parentNode) {
                    markElement.parentNode.replaceChild(strikeElement, markElement);

                    // Создаем кнопку удаления для зачеркнутого элемента
                    createDeleteButton(strikeElement);

                    // Создаем инпут для замены
                    createInputModal(strikeElement);
                }
            } catch (error) {
                console.error('Ошибка при создании зачеркивания:', error);
            }
        };

        // Проверить, является ли выделение сложным (пересекает границы элементов)
        function isComplexSelection(range) {
            const startContainer = range.startContainer;
            const endContainer = range.endContainer;

            // Если начало и конец в разных элементах
            if (startContainer !== endContainer) {
                // Проверяем, находятся ли они в одном родительском элементе
                const startParent = startContainer.nodeType === Node.TEXT_NODE
                    ? startContainer.parentElement
                    : startContainer;
                const endParent = endContainer.nodeType === Node.TEXT_NODE
                    ? endContainer.parentElement
                    : endContainer;

                // Если родители разные, это сложное выделение
                if (startParent !== endParent) {
                    return true;
                }
            }

            return false;
        }

        // Получить все узлы в диапазоне
        function getNodesInRange(range) {
            const nodes = [];
            const walker = document.createTreeWalker(
                range.commonAncestorContainer,
                NodeFilter.SHOW_ALL,
                {
                    acceptNode: function (node) {
                        if (range.intersectsNode(node)) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        return NodeFilter.FILTER_REJECT;
                    }
                }
            );

            let node;
            while (node = walker.nextNode()) {
                nodes.push(node);
            }
            return nodes;
        }

        // Получить типы тегов в выделении
        function getTagTypesInSelection(nodes) {
            const tagTypes = new Set();

            nodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Игнорируем mark теги (наши выделения) и контейнер
                    const tagName = node.tagName.toLowerCase();
                    if (tagName !== 'mark' && node.id !== 'selectable-container') {
                        tagTypes.add(tagName);
                    }
                } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                    // Добавляем тег родителя текстового узла
                    const parentTag = node.parentElement.tagName.toLowerCase();
                    if (parentTag !== 'mark' && parentTag !== 'div' && node.parentElement.id !== 'selectable-container') {
                        tagTypes.add(parentTag);
                    }
                }
            });

            return tagTypes;
        }

        // Проверить, уже ли выделен этот текст
        function isAlreadySelected(range) {
            const container = range.commonAncestorContainer;

            // Если контейнер - mark элемент
            if (container.nodeType === Node.ELEMENT_NODE &&
                container.tagName.toLowerCase() === 'mark' &&
                container.classList.contains('selected')) {
                return container;
            }

            // Если родитель контейнера - mark элемент
            if (container.nodeType === Node.TEXT_NODE &&
                container.parentElement &&
                container.parentElement.tagName.toLowerCase() === 'mark' &&
                container.parentElement.classList.contains('selected')) {
                return container.parentElement;
            }

            return null;
        }

        // Удалить выделение
        function removeSelection(range, markElement = null) {
            if (!markElement) {
                const container = range.commonAncestorContainer;

                if (container.nodeType === Node.ELEMENT_NODE &&
                    container.tagName.toLowerCase() === 'mark') {
                    markElement = container;
                } else if (container.nodeType === Node.TEXT_NODE &&
                    container.parentElement &&
                    container.parentElement.tagName.toLowerCase() === 'mark') {
                    markElement = container.parentElement;
                }
            }

            if (markElement && markElement.classList && markElement.classList.contains('selected')) {
                try {
                    const parent = markElement.parentNode;
                    if (parent) {
                        while (markElement.firstChild) {
                            parent.insertBefore(markElement.firstChild, markElement);
                        }
                        parent.removeChild(markElement);
                        parent.normalize();
                    }
                } catch (error) {
                    console.error('Ошибка при удалении выделения:', error);
                }
            }
        }

        // Добавить выделение безопасно
        function addSelection(range) {
            try {
                // Проверяем, простое ли это выделение (в пределах одного элемента)
                if (!isComplexSelection(range)) {
                    // Простое выделение - используем обычный способ
                    const mark = document.createElement('mark');
                    mark.className = 'selected';
                    mark.style.cssText = `
                        background-color: #ffeb3b;
                        padding: 0;
                        margin: 0;
                        border: none;
                        border-radius: 2px;
                    `;

                    const contents = range.extractContents();
                    mark.appendChild(contents);
                    range.insertNode(mark);

                    // НЕ добавляем кнопку удаления для желтого выделения
                } else {
                    // Сложное выделение - обрабатываем по частям
                    addComplexSelection(range);
                }
            } catch (error) {
                console.error('Ошибка при добавлении выделения:', error);
            }
        }

        // Добавить сложное выделение по частям
        function addComplexSelection(range) {
            try {
                const tempDiv = document.createElement('div');
                tempDiv.appendChild(range.cloneContents());

                // Удаляем исходное содержимое
                range.deleteContents();

                // Создаем новый контейнер для выделенного содержимого
                const mark = document.createElement('mark');
                mark.className = 'selected';
                mark.style.cssText = `
                    background-color: #ffeb3b;
                    padding: 0;
                    margin: 0;
                    border: none;
                    border-radius: 2px;
                    display: contents;
                `;

                // Восстанавливаем содержимое внутри mark, сохраняя структуру
                const fragment = document.createDocumentFragment();
                Array.from(tempDiv.childNodes).forEach(child => {
                    fragment.appendChild(child.cloneNode(true));
                });

                mark.appendChild(fragment);
                range.insertNode(mark);

                // НЕ добавляем кнопку удаления для желтого выделения
            } catch (error) {
                console.error('Ошибка при добавлении сложного выделения:', error);
            }
        }

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return (
        <>
            <style>{`
                #selectable-container .selected {
                    background-color: #ffeb3b;
                    border-radius: 2px;
                    transition: background-color 0.2s ease;
                }
                #selectable-container .selected:hover {
                    background-color: #ffc107;
                }
                #selectable-container .strikethrough-word {
                    text-decoration: line-through;
                    background-color: rgba(37, 99, 235, 0.2);
                    border-radius: 3px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                #selectable-container .strikethrough-word:hover {
                    background-color: rgba(37, 99, 235, 0.3);
                }
            `}</style>
            <div
                id="selectable-container"
                style={{
                    userSelect: 'text'
                }}
            >
                {children}
            </div>
        </>
    );
}