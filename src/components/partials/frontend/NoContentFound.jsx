import React from 'react';
import { 
  FileSearch, 
  Home, 
  ArrowLeft, 
  RefreshCw,
  Search,
  FolderOpen,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';

const NoContentFound = ({ 
  title = "No Content Found",
  description = "The content you are looking for could not be found in our database.",
  buttonText = "Go to Homepage",
  buttonLink = "/",
  showSearch = true,
  showRefresh = true,
  icon = "default"
}) => {
  const navigate = useNavigate();

  const IconComponent = () => {
    switch(icon) {
      case "search":
        return <Search className="w-20 h-20 text-blue-500" />;
      case "folder":
        return <FolderOpen className="w-20 h-20 text-amber-500" />;
      case "alert":
        return <AlertCircle className="w-20 h-20 text-red-500" />;
      default:
        return <FileSearch className="w-20 h-20 text-primary" />;
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="relative p-6 bg-white rounded-full shadow-lg">
            <IconComponent />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-3">
          {title}
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-base mb-8 leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Home Button */}
          <Link
            to={buttonLink}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Home className="w-5 h-5" />
            {buttonText}
          </Link>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-white text-foreground rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          {/* Refresh Button (Optional) */}
          {showRefresh && (
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="Refresh page"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          )}
        </div>

        {/* Search (Optional) */}
        {showSearch && (
          <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-3">
              Or search for what you're looking for
            </p>
            <div className="relative max-w-sm mx-auto">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-3 pl-12 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                      window.location.href = `/search?q=${encodeURIComponent(query)}`;
                    }
                  }
                }}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="w-1 h-1 bg-muted-foreground/30 rounded-full"></span>
          <span>ERROR 404</span>
          <span className="w-1 h-1 bg-muted-foreground/30 rounded-full"></span>
          <span>Content Not Found</span>
        </div>
      </div>
    </div>
  );
};

export default NoContentFound;