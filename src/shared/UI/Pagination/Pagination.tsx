// import React from 'react';
// import { createPages } from '../../../utils/pages';


// const Pagination = ({ pagesArray, totalPages, currentPage, changePage }) => {
//     createPages(pagesArray, totalPages, currentPage);
//     return (
//         <div className='page__wrapper'>
//             {pagesArray.map((page, index) =>
//                 <span
//                     onClick={() => changePage(page)}
//                     key={index + 1}
//                     className={currentPage === page ? "page page__current" : "page"}>
//                     {page}
//                 </span>
//             )}
//             ...
//             <span onClick={() => changePage(totalPages)} className={currentPage === totalPages ? "page page__current" : "page"}>
//                 {totalPages}
//             </span>
//         </div>
//     );
// };

// export default Pagination;