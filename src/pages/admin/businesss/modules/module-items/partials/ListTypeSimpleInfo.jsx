import React from 'react'
import DynamicIconRender from '@/components/shear/DynamicIconRender'
import DynamicIconPicker from "@/components/shear/DynamicIconPicker";

const emptyListSimpleInfo = {
  icon: null,
  title: '',
  link: '',
  target: '_blank'
}

const ListTypeSimpleInfo = ({ moduleMeta, formData, setFormData, isLoading }) => {
  // Safe extraction
  const meta = formData?.meta || moduleMeta || {}
  const listSimpleInfo = meta?.list_simple_info?.items || []
  const globalIcon = meta?.list_simple_info?.global_icon || null
  const globalTarget = meta?.list_simple_info?.global_target || '_blank'

  // Common Meta Updater Helper
  const updateListSimpleInfo = (newGlobalIcon, newGlobalTarget, newItems) => {
    setFormData((prev) => ({
      ...prev,
      meta: {
        ...prev?.meta,
        list_simple_info: {
          global_icon: newGlobalIcon,
          global_target: newGlobalTarget,
          items: newItems
        }
      }
    }))
  }

  // Handlers for Global Controls
  const handleGlobalIconChange = (iconValue) => {
    updateListSimpleInfo(iconValue, globalTarget, listSimpleInfo)
  }

  const handleGlobalTargetChange = (targetValue) => {
    updateListSimpleInfo(globalIcon, targetValue, listSimpleInfo)
  }

  // Handlers for Items
  const handleAddItem = () => {
    const newItem = { ...emptyListSimpleInfo }
    const updatedItems = [...listSimpleInfo, newItem]
    updateListSimpleInfo(globalIcon, globalTarget, updatedItems)
  }

  const handleRemoveItem = (index) => {
    const updatedItems = listSimpleInfo.filter((_, i) => i !== index)
    updateListSimpleInfo(globalIcon, globalTarget, updatedItems)
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = listSimpleInfo.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value }
      }
      return item
    })
    updateListSimpleInfo(globalIcon, globalTarget, updatedItems)
  }

  return (
    <div className="space-y-6 border p-4 rounded-xl bg-white shadow-sm">
      {/* Global Configurations Header */}
      <div className="p-4 bg-gray-50 rounded-lg border space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 border-b pb-2">Global Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Global Icon Picker */}
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <div>
              <p className="text-sm font-medium">Global Menu Icon</p>
              <p className="text-xs text-muted-foreground">Default icon for all list items</p>
            </div>
            <div className="flex items-center gap-2">
              {globalIcon && (
                <div className="p-1 border rounded bg-gray-50">
                  <DynamicIconRender name={globalIcon} className="h-4 w-4 text-blue-600" />
                </div>
              )}
              <DynamicIconPicker
                value={globalIcon}
                onChange={handleGlobalIconChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Global Target Picker */}
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <div>
              <p className="text-sm font-medium">Global Open Target</p>
              <p className="text-xs text-muted-foreground">Default open tab link behavior</p>
            </div>
            <select
              value={globalTarget}
              onChange={(e) => handleGlobalTargetChange(e.target.value)}
              disabled={isLoading}
              className="text-xs px-2.5 py-1.5 border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="_self">Same Tab (_self)</option>
              <option value="_blank">New Tab (_blank)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Item List Operations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700">List Items ({listSimpleInfo.length})</h4>
          <button
            type="button"
            onClick={handleAddItem}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            + Add Item
          </button>
        </div>

        {listSimpleInfo.length === 0 ? (
          <div className="text-center py-6 border border-dashed rounded-lg text-sm text-gray-500">
            No items added yet. Click "+ Add Item" to create one.
          </div>
        ) : (
          listSimpleInfo.map((item, index) => {
            const activeIcon = item.icon || globalIcon
            const activeTarget = item.target || globalTarget

            return (
              <div
                key={index}
                className="p-4 border rounded-lg bg-gray-50/50 space-y-3 relative"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                    
                    {/* Icon Status Indicator */}
                    {activeIcon && (
                      <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 border rounded text-[11px] text-gray-600">
                        <DynamicIconRender name={activeIcon} className="h-3.5 w-3.5 text-blue-600" />
                        <span>{item.icon ? 'Custom Icon' : 'Global Icon'}</span>
                      </div>
                    )}

                    {/* Target Status Indicator */}
                    <div className="bg-white px-2 py-0.5 border rounded text-[11px] text-gray-600">
                      Target: <span className="font-semibold">{activeTarget}</span> {item.target ? '(Custom)' : '(Global)'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={isLoading}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Title Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                      placeholder="Menu title..."
                      disabled={isLoading}
                      className="w-full text-sm px-3 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Link Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Link URL</label>
                    <input
                      type="text"
                      value={item.link || ''}
                      onChange={(e) => handleItemChange(index, 'link', e.target.value)}
                      placeholder="https://example.com"
                      disabled={isLoading}
                      className="w-full text-sm px-3 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Specific Target Field */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-gray-600">Specific Target</label>
                      {item.target && (
                        <button
                          type="button"
                          onClick={() => handleItemChange(index, 'target', null)}
                          className="text-[10px] text-blue-600 hover:underline"
                        >
                          Reset to Global ({globalTarget})
                        </button>
                      )}
                    </div>
                    <select
                      value={item.target || ''}
                      onChange={(e) => handleItemChange(index, 'target', e.target.value || null)}
                      disabled={isLoading}
                      className="w-full text-sm px-3 py-1.5 border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Use Global ({globalTarget})</option>
                      <option value="_self">Same Tab (_self)</option>
                      <option value="_blank">New Tab (_blank)</option>
                    </select>
                  </div>

                  {/* Specific Icon Override Picker */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-gray-600">Specific Icon</label>
                      {item.icon && (
                        <button
                          type="button"
                          onClick={() => handleItemChange(index, 'icon', null)}
                          className="text-[10px] text-blue-600 hover:underline"
                        >
                          Reset to Global
                        </button>
                      )}
                    </div>
                    <DynamicIconPicker
                      value={item.icon || globalIcon}
                      onChange={(val) => handleItemChange(index, 'icon', val)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ListTypeSimpleInfo