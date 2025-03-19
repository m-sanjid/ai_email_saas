"use client";
import Layout from "@/Data/Layout";
import React, { useState, useEffect } from "react";
import ElementLayoutCard from "./ElementLayoutCard";
import ElementList from "@/Data/ElementList";
import { useDragElementLayout, useEmailTemplate } from "@/app/provider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { 
  Search, Plus, Copy, Trash, Star, StarOff, 
  Settings, Filter, ArrowDownUp, FolderPlus, X, 
  Save, History, Edit, Eye, ChevronLeft, ChevronRight,
  Grid, List, LayoutIcon, Layers, Palette, Type, Image, 
  Link, Code, Zap, Clock, Bookmark, Folder
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";

function ElementsSideBar() {
  const { setDragElementLayout } = useDragElementLayout();
  const { emailTemplate } = useEmailTemplate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showLabels, setShowLabels] = useState(true);
  const [fontWeightOptions] = useState([
    { value: "100", label: "Thin" },
    { value: "200", label: "Extra Light" },
    { value: "300", label: "Light" },
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi Bold" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Extra Bold" },
    { value: "900", label: "Black" }
  ]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteElements");
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [customElements, setCustomElements] = useState(() => {
    const saved = localStorage.getItem("customElements");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState("elements");
  const [sortDirection, setSortDirection] = useState("asc");
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("elementCategories");
    return saved ? JSON.parse(saved) : ["Basic", "Advanced"];
  });
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [newElementData, setNewElementData] = useState({
    type: "Custom",
    label: "New Element",
    content: "",
    category: "Basic",
  });
  const [recentElements, setRecentElements] = useState(() => {
    const saved = localStorage.getItem("recentElements");
    return saved ? JSON.parse(saved) : [];
  });
  const [showCompactView, setShowCompactView] = useState(() => {
    const saved = localStorage.getItem("compactElementView");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("compactElementView", JSON.stringify(showCompactView));
  }, [showCompactView]);

  const addToRecents = (item) => {
    setRecentElements((prev) => {
      // Remove if exists and add to beginning
      const filtered = prev.filter((element) => element.type !== item.type);
      const updated = [item, ...filtered].slice(0, 5); // Keep only 5 most recent
      localStorage.setItem("recentElements", JSON.stringify(updated));
      return updated;
    });
  };

  const onDragStart = (item, type) => {
    // Create a properly structured element for our schema
    const element = {
      type: item.type,
      label: item.label || `${item.type} Element`,
      content: item.content || "",
      style: {
        backgroundColor: "#ffffff",
        padding: ["10px"],
        width: ["100%"],
        ...(item.type === "Text" && {
          textAlign: "left",
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
        }),
        ...(item.type === "Button" && {
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          padding: ["10px", "20px"],
          width: ["auto"],
          borderRadius: ["4px"],
          textAlign: "center",
        }),
      },
      outerStyle: {
        display: "flex",
        justifyContent: ["center"],
        backgroundColor: "#ffffff",
        width: "100%",
        padding: ["10px"],
      },
    };

    // Set image URLs based on type
    if (item.type === "LogoHeader") {
      element.imageUrl = "/logo.svg";
    } else if (item.type === "Image") {
      element.imageUrl = "/image.png";
    }

    setDragElementLayout({
      dragElement: element,
      dragType: type,
    });
    
    // Add to recent elements
    addToRecents(item);
  };

  const toggleFavorite = (item) => {
    const newFavorites = favorites.includes(item.type)
      ? favorites.filter((f) => f !== item.type)
      : [...favorites, item.type];

    setFavorites(newFavorites);
    localStorage.setItem("favoriteElements", JSON.stringify(newFavorites));
    toast.success(
      favorites.includes(item.type)
        ? "Removed from favorites"
        : "Added to favorites",
    );
  };

  const createCustomElement = () => {
    if (!newElementData.label.trim()) {
      toast.error("Element name cannot be empty");
      return;
    }

    const newElement = {
      ...newElementData,
      icon: Plus,
      category: newElementData.category || "Basic",
    };

    setCustomElements((prev) => {
      const updated = [...prev, newElement];
      localStorage.setItem("customElements", JSON.stringify(updated));
      return updated;
    });
    
    // Reset form
    setNewElementData({
      type: "Custom",
      label: "New Element",
      content: "",
      category: "Basic",
    });
    
    toast.success("Custom element created");
  };

  const deleteCustomElement = (index) => {
    setCustomElements((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("customElements", JSON.stringify(updated));
      return updated;
    });
    toast.success("Custom element deleted");
  };

  const duplicateElement = (item) => {
    const duplicate = {
      ...item,
      label: `${item.label} Copy`,
    };

    setCustomElements((prev) => {
      const updated = [...prev, duplicate];
      localStorage.setItem("customElements", JSON.stringify(updated));
      return updated;
    });
    toast.success("Element duplicated");
  };

  const addCategory = () => {
    if (!customCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    if (categories.includes(customCategory)) {
      toast.error("Category already exists");
      return;
    }
    
    const newCategories = [...categories, customCategory];
    setCategories(newCategories);
    localStorage.setItem("elementCategories", JSON.stringify(newCategories));
    setCustomCategory("");
    toast.success("Category added");
  };

  const deleteCategory = (category) => {
    // Don't delete if elements are using this category
    const elementsUsingCategory = [...ElementList, ...customElements].filter(
      (el) => el.category === category
    );
    
    if (elementsUsingCategory.length > 0) {
      toast.error(`Cannot delete category: ${elementsUsingCategory.length} elements are using it`);
      return;
    }
    
    const newCategories = categories.filter((c) => c !== category);
    setCategories(newCategories);
    localStorage.setItem("elementCategories", JSON.stringify(newCategories));
    toast.success("Category deleted");
  };

  const sortElements = (elements) => {
    return [...elements].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.label.localeCompare(b.label);
      } else {
        return b.label.localeCompare(a.label);
      }
    });
  };

  // Apply filters and search for elements
  const filteredElements = [...ElementList, ...customElements].filter(
    (element) => {
      // Filter by favorites if enabled
      if (showFavoritesOnly && !favorites.includes(element.type)) {
        return false;
      }
      
      // Filter by category if not "All"
      if (activeCategory !== "All" && element.category !== activeCategory) {
        return false;
      }
      
      // Filter by search
      return (
        element.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  );

  // Sort the filtered elements
  const sortedElements = sortElements(filteredElements);

  // Add new function to handle element preview
  const getElementPreview = (element) => {
    switch (element.type) {
      case "Text":
        return <Type className="h-4 w-4" />;
      case "Image":
        return <Image className="h-4 w-4" />;
      case "Button":
        return <Link className="h-4 w-4" />;
      case "LogoHeader":
        return <LayoutIcon className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  // Add new function to handle element grouping
  const groupElementsByType = (elements) => {
    return elements.reduce((acc, element) => {
      const type = element.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(element);
      return acc;
    }, {});
  };

  return (
    <div className={`h-screen shadow-sm flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-72'}`}>
      <div className="flex justify-between items-center px-5 py-3 border-b">
        {!isCollapsed && <h1 className="font-bold text-lg">Elements Library</h1>}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          {!isCollapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                  {viewMode === "grid" ? <List className="h-4 w-4 mr-2" /> : <Grid className="h-4 w-4 mr-2" />}
                  {viewMode === "grid" ? "List View" : "Grid View"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowLabels(!showLabels)}>
                  <Type className="h-4 w-4 mr-2" />
                  {showLabels ? "Hide Labels" : "Show Labels"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowCompactView(!showCompactView)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {showCompactView ? "Standard View" : "Compact View"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
                  <ArrowDownUp className="h-4 w-4 mr-2" />
                  Sort {sortDirection === "asc" ? "Z-A" : "A-Z"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsCustomizing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Manage Categories
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {!isCollapsed && (
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Add
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Saved
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search elements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                <Button
                  variant={activeCategory === "All" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory("All")}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Recently Used Section */}
            {recentElements.length > 0 && (
              <div>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recently Used
                </h2>
                <div className={`grid ${viewMode === "grid" ? (showCompactView ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2') : 'grid-cols-1'} gap-4 mb-6`}>
                  {recentElements.map((element, index) => (
                    <div key={`recent-${index}`} className="relative group">
                      <div
                        draggable
                        onDragStart={() => onDragStart(element, "element")}
                        className={`cursor-grab active:cursor-grabbing ${viewMode === "list" ? 'flex items-center gap-2 p-2 border rounded' : ''}`}
                      >
                        {viewMode === "list" && getElementPreview(element)}
                        <ElementLayoutCard layout={element} compact={showCompactView} showLabel={showLabels} />
                      </div>

                      {/* Element Actions */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => toggleFavorite(element)}
                          className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-50"
                          title={favorites.includes(element.type) ? "Remove from favorites" : "Add to favorites"}
                        >
                          {favorites.includes(element.type) ? (
                            <Star className="h-3 w-3 text-yellow-500" />
                          ) : (
                            <StarOff className="h-3 w-3 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Elements Section */}
            <Tabs defaultValue="elements" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="layouts">Layouts</TabsTrigger>
                <TabsTrigger value="elements">Elements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="layouts" className="mt-4">
                <div className={`grid ${viewMode === "grid" ? (showCompactView ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2') : 'grid-cols-1'} gap-4 mb-6`}>
                  {Layout.map((layout, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => onDragStart(layout, "layout")}
                      className={`cursor-grab active:cursor-grabbing ${viewMode === "list" ? 'flex items-center gap-2 p-2 border rounded' : ''}`}
                    >
                      {viewMode === "list" && getElementPreview(layout)}
                      <ElementLayoutCard layout={layout} compact={showCompactView} showLabel={showLabels} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="elements" className="mt-4">
                <div className={`grid ${viewMode === "grid" ? (showCompactView ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2') : 'grid-cols-1'} gap-4`}>
                  {sortedElements.map((element, index) => (
                    <div key={index} className="relative group">
                      <div
                        draggable
                        onDragStart={() => onDragStart(element, "element")}
                        className={`cursor-grab active:cursor-grabbing ${viewMode === "list" ? 'flex items-center gap-2 p-2 border rounded' : ''}`}
                      >
                        {viewMode === "list" && getElementPreview(element)}
                        <ElementLayoutCard layout={element} compact={showCompactView} showLabel={showLabels} />
                      </div>

                      {/* Element Actions */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => toggleFavorite(element)}
                          className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-50"
                          title={favorites.includes(element.type) ? "Remove from favorites" : "Add to favorites"}
                        >
                          {favorites.includes(element.type) ? (
                            <Star className="h-3 w-3 text-yellow-500" />
                          ) : (
                            <StarOff className="h-3 w-3 text-gray-500" />
                          )}
                        </button>
                        <button
                          onClick={() => duplicateElement(element)}
                          className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-50"
                          title="Duplicate element"
                        >
                          <Copy className="h-3 w-3 text-gray-500" />
                        </button>
                        {element.type === "Custom" && (
                          <button
                            onClick={() => deleteCustomElement(index)}
                            className="p-1 rounded-full bg-white shadow-sm hover:bg-red-50"
                            title="Delete element"
                          >
                            <Trash className="h-3 w-3 text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {sortedElements.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No elements match your search
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      )}

      {/* Collapsed View */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center py-4 space-y-4">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Layers className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Palette className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Folder className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Category Management Dialog */}
      <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                placeholder="New category name..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
              <Button onClick={addCategory} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center justify-between p-2 border rounded">
                  <span>{category}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteCategory(category)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsCustomizing(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ElementsSideBar;