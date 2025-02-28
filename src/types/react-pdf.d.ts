declare module 'react-pdf' {
  export const Document: any;
  export const Page: any;
  export const pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
  };
} 