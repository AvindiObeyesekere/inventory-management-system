import { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft, Boxes, PackagePlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storageUtil, type StoredCategory, type StoredProduct } from '@/utils/localStorage';

type CategoryFormValues = {
  name: string;
  imageUrl: string;
};

const categorySchema = Yup.object({
  name: Yup.string().trim().required('Category name is required'),
});

const getNextCategoryId = (categories: StoredCategory[]) => {
  const highestIdNumber = categories.reduce((highest, category) => {
    const match = category.id.match(/^CAT-(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `CAT-${String(highestIdNumber + 1).padStart(3, '0')}`;
};

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<StoredCategory[]>(() => storageUtil.getAllCategories());
  const [products] = useState<StoredProduct[]>(() => storageUtil.getAllProducts());
  const [selectedCategory, setSelectedCategory] = useState<StoredCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const selectedProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory.name)
    : [];

  const handleAddCategory = (values: CategoryFormValues, { resetForm }: { resetForm: () => void }) => {
    const categoryName = values.name.trim();
    const categoryExists = categories.some(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase(),
    );

    if (categoryExists) {
      setCategoryError('This category already exists.');
      return;
    }

    const nextCategories = [
      ...categories,
      {
        id: getNextCategoryId(categories),
        name: categoryName,
        imageUrl: values.imageUrl.trim() || undefined,
        createdAt: new Date().toISOString(),
      },
    ];

    setCategories(nextCategories);
    storageUtil.saveCategories(nextCategories);
    setCategoryError('');
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <div className="app-page">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {selectedCategory ? (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Categories
                </button>
                <h1 className="text-2xl font-bold app-heading">{selectedCategory.name}</h1>
                <p className="mt-1 text-sm app-muted">Products in this category.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/products/add')}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
              >
                <PackagePlus className="h-5 w-5" />
                Add Product
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {selectedProducts.length === 0 ? (
                <div className="app-card p-8 text-center text-sm text-gray-500 dark:text-gray-400 sm:col-span-2 lg:col-span-4">
                  No products found in {selectedCategory.name}.
                </div>
              ) : (
                selectedProducts.map((product) => (
                  <div key={product.productId} className="app-card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{product.productId}</p>
                        <h2 className="mt-2 text-lg font-semibold app-heading">{product.productName}</h2>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          product.stockQuantity > 0
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SKU</p>
                        <p className="mt-1 font-medium app-heading">{product.sku}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
                        <p className="mt-1 font-medium app-heading">{product.stockQuantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                        <p className="mt-1 font-medium app-heading">{product.price.toFixed(2)} Rs</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Metric</p>
                        <p className="mt-1 font-medium app-heading">{product.metricValue || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold app-heading">Categories</h1>
                <p className="mt-1 text-sm app-muted">Organize products into reusable inventory groups.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCategoryError('');
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-800"
              >
                <PackagePlus className="h-5 w-5" />
                Add Category
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className="group relative h-44 overflow-hidden rounded-lg bg-gray-900 text-left shadow"
                >
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-purple-800 text-white">
                      <Boxes className="h-10 w-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/45 transition-opacity duration-300 group-hover:opacity-0" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white [text-shadow:_0_1px_6px_rgb(0_0_0_/_70%)]">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{category.id}</p>
                    <h2 className="mt-1 text-lg font-semibold leading-tight">{category.name}</h2>
                    <p className="mt-2 text-xs text-white/80">
                      Added {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4">
          <div className="w-full max-w-md app-card shadow-xl">
            <div className="flex items-center justify-between border-b app-border px-6 py-4">
              <h2 className="text-lg font-semibold app-heading">Add Category</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                aria-label="Close add category modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Formik
              initialValues={{ name: '', imageUrl: '' }}
              validationSchema={categorySchema}
              onSubmit={handleAddCategory}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5 px-6 py-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium app-label">
                      Category Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      className="mt-1 block w-full app-field focus:border-purple-600 focus:ring-purple-100 dark:focus:ring-purple-900/50"
                    />
                    <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
                    {categoryError && <p className="mt-1 text-sm text-red-600">{categoryError}</p>}
                  </div>

                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium app-label">
                      Image Address
                    </label>
                    <Field
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      className="mt-1 block w-full app-field focus:border-purple-600 focus:ring-purple-100 dark:focus:ring-purple-900/50"
                    />
                    <ErrorMessage name="imageUrl" component="p" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div className="flex justify-end gap-3 border-t app-border pt-5">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold app-label transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Add Category
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};
