import React from 'react'
import DynamicIconRender from '@/components/shear/DynamicIconRender'

const SimpleListItemCard = ({ i, item, settings, styles }) => {
  console.log('SimpleListItemCard - ', {
    i,
    item,
    settings,
    styles
  })

  // Safe Extraction
  const {
    title,
    sub_title,
    is_featured,
    meta
  } = item?.item || {}

  const simpleInfo = meta?.list_simple_info || {}
  const itemsList = simpleInfo?.items || []
  const globalIcon = simpleInfo?.global_icon || null
  const globalTarget = simpleInfo?.global_target || '_self'

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* Card Header Section */}
      <div className="p-4 bg-linear-to-r from-slate-50 to-white border-b border-slate-100 flex items-start justify-between gap-3">
        <div className="space-y-0.5 flex-1">
          <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
            {title || 'Untitled'}
          </h3>
          {sub_title && sub_title !== title && (
            <p className="text-xs text-slate-500 line-clamp-1 font-medium">
              {sub_title}
            </p>
          )}
        </div>
      </div>

      {/* Card Body - Render items array */}
      <div className="p-3.5 flex-1 flex flex-col space-y-2">
        {itemsList.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-3">No items available</p>
        ) : (
          itemsList.map((listItem, index) => {
            // Determine active icon & target
            const activeIcon = listItem?.icon || globalIcon
            const activeTarget = listItem?.target || globalTarget
            const isExternal = activeTarget === '_blank'

            return (
              <a
                key={index}
                href={listItem?.link || '#'}
                target={activeTarget}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="group/item flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200/60 transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  {/* Item Icon */}
                  {activeIcon ? (
                    <div className="p-1.5 rounded-md bg-white border border-slate-200/60 text-blue-600 group-hover/item:border-blue-300 transition-colors shrink-0">
                      <DynamicIconRender name={activeIcon} className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 ml-1" />
                  )}

                  {/* Title */}
                  <span className="text-xs font-medium text-slate-700 group-hover/item:text-blue-700 truncate">
                    {listItem?.title || 'Link Item'}
                  </span>
                </div>

                {/* Arrow / External indicator */}
                <div className="text-slate-400 group-hover/item:text-blue-600 group-hover/item:translate-x-0.5 transition-transform shrink-0">
                  {isExternal ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </a>
            )
          })
        )}
      </div>
    </div>
  )
}

export default SimpleListItemCard