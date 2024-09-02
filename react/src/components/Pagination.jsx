import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';

export default function Pagination({meta, onPageClick}) {

  let prevActive = false;
  const onClick = ((e,link)=>{
    e.preventDefault();
    if (!link.url){
      return
    }
    onPageClick(link)
  })
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 shadow-md">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className={"relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium  hover:bg-gray-200" + 
            (meta.current_page === 1 ? ' text-gray-500  hover:bg-white': '')
          }
          
          onClick={e=> onClick
            (e,(meta.current_page > 1 ? meta.links[meta.current_page -1]: ''))
          }
          
          
          // onClick={(e)=>onClick(e,meta.links[meta.links.current_page -1 ])}
        >
          Previous
        </a>
        <a
          href="#"
          className={"relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-200"+
            (meta.current_page == meta.last_page ? ' text-gray-500  hover:bg-white' : '')
          }
          onClick={e=> onClick
            (e,(meta.current_page < meta.last_page ? meta.links[meta.current_page +1 ]: ''))
          }
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{meta.from}</span> to <span className="font-medium">{meta.to}</span> of{' '}
            <span className="font-medium">{meta.total}</span> results
          </p>
        </div>
        <div>
          {
            meta.total >= 10 &&
              <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
           
            {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
         {meta.links.map((link,index)=>(
                <a
                key={index}
                href="#"
                onClick={e => onClick(e,link)}
                aria-current="page"
                
                className={
                  "relative z-10 inline-flex items-center border px-4 py-2 text-sm font-semibold focus:z-20 hover:bg-gray-200" + (link.active ? " border-indigo-500 text-indigo-600 bg-indigo-50" : " ") +
                  (index  > 0 ? (meta.links[index-1].active ? " border-l-indigo-500": ""): null) +
                  (index == 0 ?(meta.current_page == 1 ? ' text-gray-500 hover:bg-white' : '') : '') + 
                  (index == meta.links.length - 1  ?(meta.current_page == meta.last_page ? ' text-gray-500  hover:bg-white' : '') : '')
                }
                dangerouslySetInnerHTML={{__html: link.label}}
                > 
                {
                  
                }
                 
                </a>
               
            ))} 
            
            {/* <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              2
            </a> */}
            
            
          </nav>}
        </div>
      </div>
    </div>
  )
}