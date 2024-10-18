import { useEffect } from 'react'

const useAutoDocumentTitle = (title) => {
  useEffect(() => {
    document.title = (title && title.length > 0) ? `${title} | YAKA`: 'YAKA'
  }, []);
}
export default useAutoDocumentTitle
