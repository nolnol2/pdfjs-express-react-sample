import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/pdfjs-express';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  let currnetXfdfString = null;

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/blank.pdf',
        disabledElements: [
          'annotationStyleEditButton',
          'textToolGroupButton',
          'annotationStylePopup',
          //'richTextPopup',
          'textPopup',
          'toolsButton',
          'menuButton',
          'contextMenuPopup',
          'freeHandToolGroupButton',
          'textToolGroupButton',
          'shapeToolGroupButton',
          'signatureToolButton',
          'eraserToolButton',
          'stickyToolButton',
          'freeTextToolButton',
          'miscToolGroupButton',
          'signatureModal',
          'signatureOverlay',
          'richTextUnderlineButton',
          'richTextItalicButton',
          'richTextColorPalette',
        ]
      },
      viewer.current,
    ).then((instance) => {
      const { docViewer, Annotations } = instance;
      const annotManager = docViewer.getAnnotationManager();

      instance.disableTools();
      docViewer.on('documentLoaded', () => {

        const newAnnot = new Annotations.FreeTextAnnotation();
        newAnnot.Width = 100;
        newAnnot.Height = 30;
        newAnnot.X = 10;
        newAnnot.Y = 10;
        newAnnot.FontSize = '20pt';
        newAnnot.TextColor = new Annotations.Color(0, 0, 0);
        newAnnot.setPadding(new Annotations.Rect(0, 0, 0, 0));
        newAnnot.StrokeThickness = 0;
        newAnnot.setContents('text');
        annotManager.addAnnotation(newAnnot, true);
        annotManager.redrawAnnotation(newAnnot);
      });

      instance.docViewer.on('mouseRightDown', e => {
        annotManager.exportAnnotations().then((xfdfString) => {
          console.log('export xfdf String : ', currnetXfdfString);
          currnetXfdfString = xfdfString;
        });
      });

      instance.docViewer.on('dblClick', e => {
        console.log('current xfdfString :' , currnetXfdfString);
        annotManager.importAnnotations(currnetXfdfString).then((xfdfString) => {
          console.log('import xfdf String : ', currnetXfdfString);
          currnetXfdfString = xfdfString;
        });
      });


    });
  }, []);

  return (
    <div className="App">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
