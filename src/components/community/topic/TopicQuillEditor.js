import React, { useMemo, memo } from 'react'
import ReactQuill from 'react-quill'; 

import "../../../styles/Main.css"; // 기존 스타일 재사용
import '../../../styles/community/QuillEditor.css';
import 'react-quill/dist/quill.snow.css'; // react-quill과 css파일 import 하기

const TopicQuillEditor = memo(({ quillRef, htmlContent, setHtmlContent, api }) => {

   const modules = useMemo(() => ({
      toolbar: { // 툴바에 넣을 기능들을 순서대로 나열
         container: [
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],  
            ['image']
         ]/*,
         handlers: { // 이미지 핸들러 사용하도록 설정
            image: imageHandler,
         }*/
      }
   }), [/*imageHandler*/]);

   return (

      <ReactQuill
         ref={quillRef}
         value={htmlContent}
         onChange={setHtmlContent}
         modules={modules}
         theme="snow"
         // className={styles.quillEditor}
      />
      
  );

});

export default TopicQuillEditor;
