import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function RichBox({ value, onChange }) {
    const editorRef = useRef(null);


    return (
        <Editor
            apiKey="4butsa929dbju0w6jd4ol1rug03det6wemt3hfdfyn12kg8q"
            onInit={(evt, editor) => (editorRef.current = editor)}
            value={value}
            onEditorChange={(content) => onChange(content)}
            init={{
                height: 500,
                menubar: true,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                    'emoticons quickbars codesample',
                    'directionality',
                    'table'
                ],
                toolbar: 'undo redo | formatselect | bold italic underline strikethrough | \
                forecolor backcolor | alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | link image media | \
                fontselect fontsizeselect | code codesample | ltr rtl | \
                emoticons | table tabledelete | tableprops tablerowprops tablecellprops | \
                tableinsertrowbefore tableinsertrowafter tabledeleterow | \
                tableinsertcolbefore tableinsertcolafter tabledeletecol | \
                removeformat | help',
                content_style: `
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
                        font-size: 14px; 
                        line-height: 1.6; 
                        color: #333;
                        margin: 8px;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 16px 0;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    table td, table th {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                    }
                    table th {
                        background-color: #f8f9fa;
                        font-weight: 600;
                        color: #333;
                    }
                    table tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    table tr:hover {
                        background-color: #f1f1f1;
                    }
                    .mce-item-table {
                        width: 100%;
                    }
                `,
                table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
                table_default_styles: {
                    'width': '100%',
                    'border-collapse': 'collapse',
                    'border': '1px solid #ddd'
                },
                table_default_attributes: {
                    'border': '1'
                },
                table_class_list: [
                    { title: 'Default', value: '' },
                    { title: 'Striped', value: 'table-striped' },
                    { title: 'Bordered', value: 'table-bordered' },
                    { title: 'Hover', value: 'table-hover' }
                ],
                table_cell_class_list: [
                    { title: 'Default', value: '' },
                    { title: 'Header', value: 'table-header' },
                    { title: 'Highlight', value: 'highlight-cell' },
                    { title: 'Centered', value: 'text-center' },
                    { title: 'Right-aligned', value: 'text-right' }
                ],
                table_row_class_list: [
                    { title: 'Default', value: '' },
                    { title: 'Header', value: 'table-header-row' },
                    { title: 'Highlight', value: 'highlight-row' }
                ],
                table_advtab: true,
                table_cell_advtab: true,
                table_row_advtab: true,
                table_appearance_options: true,
                table_style_by_css: true,
                table_responsive_width: true,
                table_grid: true,
                table_tab_navigation: true,
                table_context_menu_entries: {
                    insert_row_before: {
                        title: 'Insert row before',
                        cmd: 'mceTableInsertRowBefore'
                    },
                    insert_row_after: {
                        title: 'Insert row after',
                        cmd: 'mceTableInsertRowAfter'
                    },
                    delete_row: {
                        title: 'Delete row',
                        cmd: 'mceTableDeleteRow'
                    },
                    insert_col_before: {
                        title: 'Insert column before',
                        cmd: 'mceTableInsertColBefore'
                    },
                    insert_col_after: {
                        title: 'Insert column after',
                        cmd: 'mceTableInsertColAfter'
                    },
                    delete_col: {
                        title: 'Delete column',
                        cmd: 'mceTableDeleteCol'
                    },
                    cell_properties: {
                        title: 'Cell properties',
                        cmd: 'mceTableCellProps'
                    },
                    row_properties: {
                        title: 'Row properties',
                        cmd: 'mceTableRowProps'
                    },
                    table_properties: {
                        title: 'Table properties',
                        cmd: 'mceTableProps'
                    },
                    delete_table: {
                        title: 'Delete table',
                        cmd: 'mceTableDelete'
                    }
                },
                branding: false
            }}
        />
    );
}