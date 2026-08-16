import React from 'react'

const BookListItemCard = ({ i, item, settings, styles }) => {
  // Safe data extraction
  const {
    title,
    sub_title,
    description,
    image_full_path,
    is_featured,
    meta
  } = item?.item || {}

  const bookInfo = meta?.list_book_info || {}
  const listButtons = bookInfo?.list_buttons || []
  const pdfFileUrl = bookInfo?.list_file || null
  const pdfFileName = bookInfo?.list_file_name || 'PDF'

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden h-full max-w-xs">
      
      {/* Image Area with Overlays */}
      <div className="relative w-full aspect-[4/5] bg-slate-100 overflow-hidden">
        {image_full_path ? (
          <img
            src={image_full_path}
            alt={title || 'Book Cover'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-3 text-center">
            <svg className="w-8 h-8 mb-1 stroke-current opacity-60" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="text-[10px] font-medium">No Image</span>
          </div>
        )}

        {/* Top-Left: Featured Badge */}
        {Boolean(is_featured) && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-amber-500/95 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs tracking-wider uppercase">
            Featured
          </span>
        )}

        {/* Bottom-Right Overlay: PDF Download Button */}
        {pdfFileUrl && (
          <a
            href={pdfFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={pdfFileName}
            className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/85 hover:bg-red-600 backdrop-blur-md text-white text-[10px] font-medium rounded-full shadow-md transition-all duration-300 group/pdf max-w-[85%]"
          >
            <svg className="w-3.5 h-3.5 text-red-400 group-hover/pdf:text-white transition-colors shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{pdfFileName}</span>
            <svg className="w-3 h-3 opacity-80 group-hover/pdf:translate-y-0.5 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex flex-col flex-grow justify-between space-y-3">
        <div className="space-y-1">
          {/* Book Title */}
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
            {title || 'Untitled Book'}
          </h3>

          {/* Subtitle */}
          {sub_title && sub_title !== title && (
            <p className="text-[11px] font-medium text-slate-400 line-clamp-1">
              {sub_title}
            </p>
          )}

          {/* Description */}
          {description && (
            <div
              className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pt-0.5"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        {/* Compact Action Buttons */}
        {listButtons.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
            {listButtons.map((btn, index) => {
              const isBuyBtn = btn.key === 'buy' || btn.title?.toLowerCase().includes('buy')
              const formattedUrl = btn.url ? btn.url.replace(':id', item.id) : '#'
              const isExternal = formattedUrl.startsWith('http')

              return (
                <a
                  key={btn.key || index}
                  href={formattedUrl}
                  target={isExternal ? '_blank' : '_self'}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={`flex-1 py-1.5 px-2 text-[11px] font-medium rounded-lg text-center transition-all duration-200 flex items-center justify-center gap-1 ${
                    isBuyBtn
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xs hover:shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  <span className="truncate">{btn.title || 'Action'}</span>
                  {isExternal && (
                    <svg className="w-2.5 h-2.5 opacity-70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookListItemCard