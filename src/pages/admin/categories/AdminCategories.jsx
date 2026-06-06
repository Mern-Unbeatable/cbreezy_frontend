import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddCategoryModal from "./AddCategoryModal";
import AddSubCategoryModal from "./AddSubCategoryModal";
import Pagination from "../../../components/Pagination";
import {
  createAdminCategory,
  createAdminSubCategory,
  deleteAdminEventCategory,
  deleteAdminServiceCategory,
  deleteAdminServiceSubCategory,
  fetchAdminCategories,
  updateAdminEventCategory,
  updateAdminServiceCategory,
} from "../../../features/admin/adminSlice";

const SERVICE_PAGE_SIZE = 8;
const EVENT_PAGE_SIZE = 8;
const ADMIN_CATEGORIES_ACTIVE_TAB_KEY = "admin-categories-active-tab";

const parseSubCategoryNames = (value) =>
  String(value || "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

const AdminCategories = () => {
  const dispatch = useDispatch();
  const serviceCategories = useSelector((state) => state.admin.serviceCategories);
  const eventCategories = useSelector((state) => state.admin.eventCategories);
  const categoriesLoading = useSelector((state) => state.admin.categoriesLoading);
  const categoriesError = useSelector((state) => state.admin.categoriesError);

  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setSubCategoryModalOpen] = useState(false);
  const [categoryModalType, setCategoryModalType] = useState("service");
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = window.sessionStorage.getItem(ADMIN_CATEGORIES_ACTIVE_TAB_KEY);
    return savedTab === "event" ? "event" : "service";
  });
  const [servicePage, setServicePage] = useState(1);
  const [eventPage, setEventPage] = useState(1);

  const [serviceEditor, setServiceEditor] = useState({
    isOpen: false,
    categoryId: "",
    categoryName: "",
    subCategories: [],
    subTagInput: "",
    editingSubCategoryId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    categoryType: "service",
    categoryId: "",
    categoryName: "",
  });

  const [eventEditState, setEventEditState] = useState({
    isOpen: false,
    categoryId: "",
    name: "",
  });

  const [subDeleteState, setSubDeleteState] = useState({
    isOpen: false,
    categoryId: "",
    subCategoryId: "",
    subCategoryName: "",
    categoryName: "",
  });
  const [showCategoriesError, setShowCategoriesError] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  useEffect(() => {
    window.sessionStorage.setItem(ADMIN_CATEGORIES_ACTIVE_TAB_KEY, activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!categoriesError) {
      setShowCategoriesError(false);
      return;
    }

    setShowCategoriesError(true);
    const timer = window.setTimeout(() => {
      setShowCategoriesError(false);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [categoriesError]);

  const totalServicePages = Math.max(1, Math.ceil(serviceCategories.length / SERVICE_PAGE_SIZE));
  const serviceStartIndex = (servicePage - 1) * SERVICE_PAGE_SIZE;
  const paginatedServiceCategories = serviceCategories.slice(
    serviceStartIndex,
    serviceStartIndex + SERVICE_PAGE_SIZE,
  );
  const totalEventPages = Math.max(1, Math.ceil(eventCategories.length / EVENT_PAGE_SIZE));
  const eventStartIndex = (eventPage - 1) * EVENT_PAGE_SIZE;
  const paginatedEventCategories = eventCategories.slice(eventStartIndex, eventStartIndex + EVENT_PAGE_SIZE);

  useEffect(() => {
    if (servicePage > totalServicePages) {
      setServicePage(totalServicePages);
    }
  }, [servicePage, totalServicePages]);

  useEffect(() => {
    if (eventPage > totalEventPages) {
      setEventPage(totalEventPages);
    }
  }, [eventPage, totalEventPages]);

  const handleSaveCategory = async ({ name, type, image }) => {
    if (!name?.trim()) {
      toast.error("Category name is required");
      return false;
    }

    if (!type?.trim()) {
      toast.error("Category type is required");
      return false;
    }

    try {
      await toast.promise(
        dispatch(
          createAdminCategory({
            type,
            name: name.trim(),
            image,
          }),
        ).unwrap(),
        {
          pending: "Creating category...",
          success: "Category created successfully",
          error: {
            render({ data }) {
              return data || "Failed to create category";
            },
          },
        },
      );
      return true;
    } catch {
      return false;
    }
  };

  const handleSaveSubCategory = async ({ serviceCategoryId, subCategoryName }) => {
    if (!serviceCategoryId?.trim()) {
      toast.error("Service category is required");
      return false;
    }

    if (!subCategoryName?.trim()) {
      toast.error("Sub category name is required");
      return false;
    }

    try {
      await toast.promise(
        dispatch(
          createAdminSubCategory({
            serviceCategoryId,
            name: subCategoryName.trim(),
          }),
        ).unwrap(),
        {
          pending: "Creating sub category...",
          success: "Sub category created successfully",
          error: {
            render({ data }) {
              return data || "Failed to create sub category";
            },
          },
        },
      );
      return true;
    } catch {
      return false;
    }
  };

  const openServiceEditor = (category) => {
    const normalizedSubCategories = (Array.isArray(category.subcategories) ? category.subcategories : [])
      .map((sub) => ({
        id: sub?.id == null ? "" : String(sub.id),
        name: String(sub?.name || "").trim(),
      }))
      .filter((sub) => sub.name);

    setServiceEditor({
      isOpen: true,
      categoryId: String(category.id),
      categoryName: category.name,
      subCategories: normalizedSubCategories,
      subTagInput: "",
      editingSubCategoryId: "",
    });
  };

  const closeServiceEditor = () => {
    setServiceEditor({
      isOpen: false,
      categoryId: "",
      categoryName: "",
      subCategories: [],
      subTagInput: "",
      editingSubCategoryId: "",
    });
  };

  const openDeleteModal = ({ categoryId, categoryName }) => {
    setDeleteState({
      isOpen: true,
      categoryType: "service",
      categoryId: String(categoryId),
      categoryName,
    });
  };

  const openEventDeleteModal = ({ categoryId, categoryName }) => {
    setActiveTab("event");
    setDeleteState({
      isOpen: true,
      categoryType: "event",
      categoryId: String(categoryId),
      categoryName,
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      categoryType: "service",
      categoryId: "",
      categoryName: "",
    });
  };

  const handleServiceEditorSave = async () => {
    const categoryName = serviceEditor.categoryName.trim();
    const mergedSubCategories = [...serviceEditor.subCategories];
    const draftName = String(serviceEditor.subTagInput || "").replaceAll("#", "").trim();

    if (draftName) {
      if (serviceEditor.editingSubCategoryId) {
        const targetIndex = mergedSubCategories.findIndex(
          (item) => String(item.id) === String(serviceEditor.editingSubCategoryId),
        );

        if (targetIndex >= 0) {
          mergedSubCategories[targetIndex] = {
            ...mergedSubCategories[targetIndex],
            name: draftName,
          };
        }
      } else {
        toast.info("New subcategories are not created from Edit. Use the Sub Category button to create new ones.");
      }
    }

    const seen = new Set();
    const subcategoriesPayload = mergedSubCategories.filter((item) => {
      const key = String(item?.name || "").trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const updatableSubcategories = subcategoriesPayload.filter((item) => item.id);

    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }

    try {
      await toast.promise(
        (async () => {
          await dispatch(
            updateAdminServiceCategory({
              categoryId: serviceEditor.categoryId,
              categoryName,
              subcategories: updatableSubcategories,
            }),
          ).unwrap();

          await dispatch(fetchAdminCategories()).unwrap();
        })(),
        {
          pending: "Updating service category...",
          success: "Service category updated",
          error: {
            render({ data }) {
              return data || "Failed to update service category";
            },
          },
        },
      );

      closeServiceEditor();
    } catch {
      // handled by toast.promise
    }
  };

  const handleDeleteCategory = async () => {
    if (deleteState.categoryType === "event") {
      setActiveTab("event");
      try {
        await toast.promise(dispatch(deleteAdminEventCategory(deleteState.categoryId)).unwrap(), {
          pending: "Deleting event category...",
          success: "Event category deleted",
          error: {
            render({ data }) {
              return data || "Failed to delete event category";
            },
          },
        });
      } catch {
        // handled by toast.promise
      } finally {
        closeDeleteModal();
      }
      return;
    }

    let isDeleted = false;

    try {
      await toast.promise(dispatch(deleteAdminServiceCategory(deleteState.categoryId)).unwrap(), {
        pending: "Deleting service category...",
        success: "Service category deleted",
        error: {
          render({ data }) {
            return data || "Failed to delete service category";
          },
        },
      });
      isDeleted = true;
    } catch {
      // handled by toast.promise
    } finally {
      closeDeleteModal();
    }

    if (isDeleted && serviceEditor.isOpen && serviceEditor.categoryId === deleteState.categoryId) {
      closeServiceEditor();
    }
  };

  const addSubTagsFromInput = () => {
    const next = parseSubCategoryNames(serviceEditor.subTagInput.replaceAll("#", ""));
    if (next.length === 0) return;

    setServiceEditor((prev) => {
      if (!prev.editingSubCategoryId) {
        toast.info("To edit a subcategory, click an existing tag first.");
        return prev;
      }

      const nextSubCategories = [...prev.subCategories];

      if (next.length >= 1) {
        const index = nextSubCategories.findIndex((item) => String(item.id) === String(prev.editingSubCategoryId));
        if (index < 0) {
          toast.error("Selected subcategory was not found. Please try again.");
          return {
            ...prev,
            subTagInput: "",
            editingSubCategoryId: "",
          };
        }

        nextSubCategories[index] = {
          ...nextSubCategories[index],
          name: next[0],
        };
      } else {
        return prev;
      }

      const seen = new Set();
      const uniqueSubCategories = nextSubCategories.filter((item) => {
        const key = String(item?.name || "").trim().toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      return {
        ...prev,
        subCategories: uniqueSubCategories,
        subTagInput: "",
        editingSubCategoryId: "",
      };
    });
  };

  const openSubCategoryDeleteModal = ({ categoryId, subCategoryId, subCategoryName, categoryName }) => {
    setSubDeleteState({
      isOpen: true,
      categoryId: String(categoryId),
      subCategoryId: String(subCategoryId),
      subCategoryName,
      categoryName,
    });
  };

  const closeSubCategoryDeleteModal = () => {
    setSubDeleteState({
      isOpen: false,
      categoryId: "",
      subCategoryId: "",
      subCategoryName: "",
      categoryName: "",
    });
  };

  const handleConfirmSubCategoryDelete = async () => {
    try {
      await toast.promise(
        dispatch(
          deleteAdminServiceSubCategory({
            categoryId: subDeleteState.categoryId,
            subCategoryId: subDeleteState.subCategoryId,
          }),
        ).unwrap(),
        {
          pending: "Deleting sub category...",
          success: "Sub category deleted",
          error: {
            render({ data }) {
              return data || "Failed to delete sub category";
            },
          },
        },
      );
      closeSubCategoryDeleteModal();
    } catch {
      // handled by toast.promise
    }
  };

  const openEventCategoryEdit = (category) => {
    setActiveTab("event");
    setEventEditState({
      isOpen: true,
      categoryId: String(category.id),
      name: category.name,
    });
  };

  const closeEventEditModal = () => {
    setEventEditState({
      isOpen: false,
      categoryId: "",
      name: "",
    });
  };

  const handleApplyEventEdit = async () => {
    setActiveTab("event");
    const nextName = eventEditState.name.trim();
    if (!nextName) {
      toast.error("Name is required");
      return;
    }

    try {
      await toast.promise(
        dispatch(
          updateAdminEventCategory({
            categoryId: eventEditState.categoryId,
            categoryName: nextName,
          }),
        ).unwrap(),
        {
          pending: "Updating event category...",
          success: "Event category updated",
          error: {
            render({ data }) {
              return data || "Failed to update event category";
            },
          },
        },
      );
      closeEventEditModal();
    } catch {
      // handled by toast.promise
    }
  };

  const serviceEditorTags = serviceEditor.subCategories;

  return (
    <div className="relative min-h-screen">
      <section className="space-y-6 md:space-y-8 px-2 md:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-[36px] leading-none font-medium text-[#111827]">
            Category Management
          </h1>
          <p className="mt-2 text-sm md:text-base text-[#6b7280]">
            Manage service and event categories with clear hierarchy and editable rows.
          </p>
        </div>

        {categoriesError && showCategoriesError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {categoriesError}
          </div>
        )}

        <div className="rounded-xl border border-[#ececec] bg-white p-1.5 w-full sm:w-fit">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("service")}
              className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "service" ? "bg-[#e97c35] text-white" : "bg-[#f7f7f8] text-[#374151]"
              }`}
            >
              Service
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("event")}
              className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "event" ? "bg-[#e97c35] text-white" : "bg-[#f7f7f8] text-[#374151]"
              }`}
            >
              Event
            </button>
          </div>
        </div>

        {activeTab === "service" && (
          <div>
            <div className="mb-3 md:mb-5 flex items-center justify-between gap-2 sm:gap-3">
              <h2 className="text-2xl sm:text-3xl md:text-[36px] leading-none font-medium text-[#111827]">
                Service Categories
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSubCategoryModalOpen(true)}
                  className="inline-flex items-center gap-1 rounded-md border border-[#f6d3bd] bg-[#fff1e8] px-3 py-2 text-xs font-medium text-[#c35f20]"
                  aria-label="Add Sub Category"
                >
                  <Plus className="h-4 w-4" /> Sub Category
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryModalType("service");
                    setCategoryModalOpen(true);
                  }}
                  className="h-8 w-8 rounded-full bg-[#E97C35] text-white grid place-items-center shrink-0"
                  aria-label="Add Category"
                >
                  <Plus className="h-6 w-6" />
                </button>
              </div>
            </div>

            {categoriesLoading ? (
              <div className="rounded-lg border border-[#ececec] bg-white p-6 text-center text-sm text-[#6b7280]">
                Loading categories...
              </div>
            ) : serviceCategories.length === 0 ? (
              <div className="rounded-lg border border-[#ececec] bg-white p-6 text-center text-sm text-[#6b7280]">
                No service category found.
              </div>
            ) : (
              <div className="rounded-lg border border-[#ececec] bg-white overflow-hidden">
                <div className="hidden md:block overflow-x-auto overscroll-x-contain [scrollbar-gutter:stable]">
                  <table className="w-full min-w-230 text-left text-sm md:text-base table-auto">
                    <colgroup>
                      <col className="w-[20%]" />
                      <col className="w-[65%]" />
                      <col className="w-[15%]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-[#efefef] text-[#374151]">
                        <th className="px-3 md:px-4 py-3 font-medium whitespace-nowrap">Category</th>
                        <th className="px-3 md:px-4 py-3 font-medium whitespace-nowrap">Sub Categories</th>
                        <th className="px-3 md:px-4 py-3 font-medium whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedServiceCategories.map((category) => (
                        <tr key={category.id} className="border-b border-[#f3f4f6] text-[#374151] align-top">
                          <td className="px-3 md:px-4 py-3 md:py-4 align-top wrap-break-word">
                            <div className="flex items-center gap-3">
                              {category.image ? (
                                <button
                                  type="button"
                                  onClick={() => window.open(category.image, "_blank", "noopener,noreferrer")}
                                  className="h-12 w-12 rounded-md overflow-hidden border border-[#e5e7eb] bg-[#f9fafb] shrink-0"
                                  aria-label="View category image"
                                >
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="h-full w-full object-cover"
                                  />
                                </button>
                              ) : (
                                <div className="h-12 w-12 rounded-md border border-dashed border-[#d1d5db] bg-[#f9fafb] text-[10px] text-[#9ca3af] grid place-items-center shrink-0">
                                  No image
                                </div>
                              )}
                              <span className="wrap-break-word">{category.name}</span>
                            </div>
                          </td>
                          <td className="px-3 md:px-4 py-3 md:py-4">
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(category.subcategories) && category.subcategories.length > 0 ? (
                                category.subcategories.map((sub) => (
                                  <span
                                    key={sub.id}
                                    className="inline-flex items-center gap-1 rounded-full border border-[#2db18e] px-2.5 py-1 text-xs bg-[#ecf8f4] text-[#374151]"
                                  >
                                    {sub.name}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openSubCategoryDeleteModal({
                                          categoryId: category.id,
                                          subCategoryId: sub.id,
                                          subCategoryName: sub.name,
                                          categoryName: category.name,
                                        })
                                      }
                                      className="text-[#ef4444]"
                                      aria-label="Delete sub category"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-[#9ca3af]">No sub category</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openServiceEditor(category)}
                                className="inline-flex items-center gap-1 rounded border border-[#f6d3bd] bg-[#fff1e8] px-2.5 py-1.5 text-xs font-medium text-[#c35f20]"
                              >
                                <Pencil className="h-3.5 w-3.5" /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  openDeleteModal({
                                    categoryId: category.id,
                                    categoryName: category.name,
                                  })
                                }
                                className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden p-3 space-y-3">
                  {paginatedServiceCategories.map((category) => (
                    <article key={category.id} className="rounded-xl border border-[#d9e6f2] bg-white p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-1.5">
                            {category.image ? (
                              <button
                                type="button"
                                onClick={() => window.open(category.image, "_blank", "noopener,noreferrer")}
                                className="h-12 w-12 rounded-md overflow-hidden border border-[#e5e7eb] bg-[#f9fafb] shrink-0"
                                aria-label="View category image"
                              >
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="h-full w-full object-cover"
                                />
                              </button>
                            ) : (
                              <div className="h-12 w-12 rounded-md border border-dashed border-[#d1d5db] bg-[#f9fafb] text-[10px] text-[#9ca3af] grid place-items-center shrink-0">
                                No image
                              </div>
                            )}
                            <h3 className="text-base font-semibold text-[#111827] wrap-break-word">{category.name}</h3>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {Array.isArray(category.subcategories) && category.subcategories.length > 0 ? (
                              category.subcategories.map((sub) => (
                                <span
                                  key={sub.id}
                                  className="inline-flex items-center gap-1 rounded-full border border-[#2db18e] px-2 py-1 text-[11px] bg-[#ecf8f4] text-[#374151]"
                                >
                                  {sub.name}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openSubCategoryDeleteModal({
                                        categoryId: category.id,
                                        subCategoryId: sub.id,
                                        subCategoryName: sub.name,
                                        categoryName: category.name,
                                      })
                                    }
                                    className="text-[#ef4444]"
                                    aria-label="Delete sub category"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-[#9ca3af]">No sub category</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openServiceEditor(category)}
                            className="inline-flex items-center gap-1 rounded border border-[#f6d3bd] bg-[#fff1e8] px-2 py-1 text-xs text-[#c35f20]"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal({
                                categoryId: category.id,
                                categoryName: category.name,
                              })
                            }
                            className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {serviceCategories.length > SERVICE_PAGE_SIZE && (
                  <div className="border-t border-[#efefef] bg-white px-2 md:px-3 py-2">
                    <Pagination
                      current={servicePage}
                      total={totalServicePages}
                      onPageChange={setServicePage}
                      totalResults={serviceCategories.length}
                      resultsPerPage={SERVICE_PAGE_SIZE}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "event" && (
          <div>
            <div className="mb-3 md:mb-5 flex items-center justify-between gap-2 sm:gap-3">
              <h2 className="text-2xl sm:text-3xl md:text-[36px] leading-none font-medium text-[#111827]">
                Event Categories
              </h2>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("event");
                  setCategoryModalType("event");
                  setCategoryModalOpen(true);
                }}
                className="h-8 w-8 rounded-full bg-[#E97C35] text-white grid place-items-center shrink-0"
                aria-label="Add Event Category"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>

            {categoriesLoading ? (
              <div className="rounded-lg border border-[#ececec] bg-white p-6 text-center text-sm text-[#6b7280]">
                Loading event categories...
              </div>
            ) : eventCategories.length === 0 ? (
              <div className="rounded-lg border border-[#ececec] bg-white p-6 text-center text-sm text-[#6b7280]">
                No event category found.
              </div>
            ) : (
              <div className="rounded-lg border border-[#ececec] bg-white overflow-hidden">
                <div className="hidden md:block overflow-x-auto overscroll-x-contain [scrollbar-gutter:stable]">
                  <table className="w-full min-w-120 text-left text-sm md:text-base table-auto">
                    <colgroup>
                      <col className="w-[85%]" />
                      <col className="w-[15%]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-[#efefef] text-[#374151]">
                        <th className="px-3 md:px-4 py-3 font-medium whitespace-nowrap">Category</th>
                        <th className="px-3 md:px-4 py-3 font-medium whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEventCategories.map((item) => (
                        <tr key={item.id} className="border-b border-[#f3f4f6] text-[#374151] align-top">
                          <td className="px-3 md:px-4 py-3 md:py-4 wrap-break-word">
                            <div className="flex items-center gap-3">
                              {item.image ? (
                                <button
                                  type="button"
                                  onClick={() => window.open(item.image, "_blank", "noopener,noreferrer")}
                                  className="h-12 w-12 rounded-md overflow-hidden border border-[#e5e7eb] bg-[#f9fafb] shrink-0"
                                  aria-label="View category image"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </button>
                              ) : (
                                <div className="h-12 w-12 rounded-md border border-dashed border-[#d1d5db] bg-[#f9fafb] text-[10px] text-[#9ca3af] grid place-items-center shrink-0">
                                  No image
                                </div>
                              )}
                              <span className="wrap-break-word">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEventCategoryEdit(item)}
                                className="inline-flex items-center gap-1 rounded border border-[#f6d3bd] bg-[#fff1e8] px-2.5 py-1.5 text-xs font-medium text-[#c35f20]"
                                aria-label={`Edit ${item.name}`}
                              >
                                <Pencil className="h-3.5 w-3.5" /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  openEventDeleteModal({
                                    categoryId: item.id,
                                    categoryName: item.name,
                                  })
                                }
                                className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600"
                                aria-label={`Delete ${item.name}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden p-3 space-y-3">
                  {paginatedEventCategories.map((item) => (
                    <article key={item.id} className="rounded-xl border border-[#d9e6f2] bg-white p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-1.5">
                            {item.image ? (
                              <button
                                type="button"
                                onClick={() => window.open(item.image, "_blank", "noopener,noreferrer")}
                                className="h-12 w-12 rounded-md overflow-hidden border border-[#e5e7eb] bg-[#f9fafb] shrink-0"
                                aria-label="View category image"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </button>
                            ) : (
                              <div className="h-12 w-12 rounded-md border border-dashed border-[#d1d5db] bg-[#f9fafb] text-[10px] text-[#9ca3af] grid place-items-center shrink-0">
                                No image
                              </div>
                            )}
                            <h3 className="text-base font-semibold text-[#111827] wrap-break-word">{item.name}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEventCategoryEdit(item)}
                            className="inline-flex items-center gap-1 rounded border border-[#f6d3bd] bg-[#fff1e8] px-2 py-1 text-xs text-[#c35f20]"
                            aria-label={`Edit ${item.name}`}
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              openEventDeleteModal({
                                categoryId: item.id,
                                categoryName: item.name,
                              })
                            }
                            className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-600"
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {eventCategories.length > EVENT_PAGE_SIZE && (
                  <div className="border-t border-[#efefef] bg-white px-2 md:px-3 py-2">
                    <Pagination
                      current={eventPage}
                      total={totalEventPages}
                      onPageChange={setEventPage}
                      totalResults={eventCategories.length}
                      resultsPerPage={EVENT_PAGE_SIZE}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {serviceEditor.isOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-xl border border-[#e5e7eb] bg-white p-4 md:p-5">
            <h3 className="text-lg md:text-xl font-semibold text-[#111827]">Edit Service Category</h3>

            <div className="mt-4">
              <label className="block text-sm text-[#374151] mb-1.5">Category</label>
              <input
                type="text"
                value={serviceEditor.categoryName}
                onChange={(e) => setServiceEditor((prev) => ({ ...prev, categoryName: e.target.value }))}
                className="h-10 w-full rounded-md border border-[#d1d5db] bg-white px-3 text-sm text-[#111827] focus:outline-none"
                placeholder="Enter category name"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-[#374151] mb-1.5">Sub Categories (use #tag and press Enter)</label>
              <div className="min-h-24 w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2">
                <div className="flex flex-wrap gap-2">
                  {serviceEditorTags.length > 0 ? (
                    serviceEditorTags.map((item) => (
                      <button
                        key={item.id || item.name}
                        type="button"
                        onClick={() => {
                          setServiceEditor((prev) => ({
                            ...prev,
                            subTagInput: item.name,
                            editingSubCategoryId: item.id || "",
                          }));
                        }}
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${
                          String(serviceEditor.editingSubCategoryId) === String(item.id)
                            ? "border-[#e97c35] bg-[#fff1e8] text-[#c35f20]"
                            : "border-[#2db18e] bg-[#ecf8f4] text-[#374151]"
                        }`}
                        title="Click to edit"
                      >
                        #{item.name}
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-[#9ca3af]">No sub categories</span>
                  )}

                  <input
                    type="text"
                    value={serviceEditor.subTagInput}
                    onChange={(e) => setServiceEditor((prev) => ({ ...prev, subTagInput: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addSubTagsFromInput();
                      }

                      if (e.key === "Escape") {
                        setServiceEditor((prev) => ({
                          ...prev,
                          subTagInput: "",
                          editingSubCategoryId: "",
                        }));
                      }
                    }}
                    onBlur={addSubTagsFromInput}
                    className="h-7 min-w-36 flex-1 bg-transparent text-sm text-[#111827] focus:outline-none"
                    placeholder="Select a tag, edit text, press Enter"
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-[#9ca3af]">
                Click a sub category tag to edit it, then press Enter to apply the change.
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeServiceEditor}
                className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm text-[#374151]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleServiceEditorSave}
                className="rounded-md bg-[#e97c35] px-3 py-2 text-sm text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteState.isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 p-4 flex items-center justify-center"
          onClick={closeDeleteModal}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[#e5e7eb] bg-white p-4 md:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#111827]">Delete Category</h3>
            <p className="mt-2 text-sm text-[#6b7280]">
              {deleteState.categoryType === "event" ? (
                <>
                  Are you sure you want to delete <span className="font-medium text-[#111827]">{deleteState.categoryName}</span>?
                </>
              ) : (
                <>
                  This will delete <span className="font-medium text-[#111827]">{deleteState.categoryName}</span> and all of its sub categories.
                </>
              )}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm text-[#374151]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {eventEditState.isOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 p-4 flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl border border-[#e5e7eb] bg-white p-4 md:p-5">
            <h3 className="text-lg md:text-xl font-semibold text-[#111827]">Edit Name</h3>
            <input
              type="text"
              value={eventEditState.name}
              onChange={(e) => setEventEditState((prev) => ({ ...prev, name: e.target.value }))}
              className="mt-3 h-10 w-full rounded-md border border-[#d1d5db] bg-white px-3 text-sm text-[#111827] focus:outline-none"
              placeholder="Enter name"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEventEditModal}
                className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm text-[#374151]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyEventEdit}
                className="rounded-md bg-[#e97c35] px-3 py-2 text-sm text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {subDeleteState.isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 p-4 flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl border border-[#e5e7eb] bg-white p-4 md:p-5">
            <h3 className="text-lg font-semibold text-[#111827]">Delete Sub Category</h3>
            <p className="mt-2 text-sm text-[#6b7280]">
              Are you sure you want to delete <span className="font-medium text-[#111827]">{subDeleteState.subCategoryName}</span>?
            </p>
            <p className="mt-1 text-xs text-[#9ca3af]">
              Category: <span className="font-medium text-[#374151]">{subDeleteState.categoryName || "N/A"}</span>
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeSubCategoryDeleteModal}
                className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm text-[#374151]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubCategoryDelete}
                className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setCategoryModalType("service");
        }}
        onSave={handleSaveCategory}
        fixedType={categoryModalType}
      />
      <AddSubCategoryModal
        isOpen={isSubCategoryModalOpen}
        onClose={() => setSubCategoryModalOpen(false)}
        serviceCategoryItems={serviceCategories}
        onSave={handleSaveSubCategory}
      />
    </div>
  );
};

export default AdminCategories;
